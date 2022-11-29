class ShpoifyBulkOperation  < GraphqlService
    GET_ORDERS_IN_BULK = <<-GRAPHQL
        mutation {
            bulkOperationRunQuery(
                query: """
                    {
                    orders {
                    edges {
                        node {
                        id
                        legacyResourceId
                        createdAt
                        cancelledAt
                        name
                        refunds {
                            id
                        }
                        channel {
                            app {
                            id
                            }
                        }
                        totalPrice
                        fulfillments {
                            id
                            order {
                            id
                            createdAt
                            }
                        }
                        metafields {
                            edges {
                            node {
                                id
                                legacyResourceId
                                key
                                value
                            }
                            }
                        }
                        shippingAddress {
                            address1
                            address2
                            city
                            company
                            country
                            countryCode
                            countryCodeV2
                            firstName
                            id
                            formattedArea
                            lastName
                            latitude
                            longitude
                            name
                            phone
                            province
                            provinceCode
                            zip
                            formatted(withName: false)
                        }
                        lineItems {
                            edges {
                            node {
                                __typename
                                quantity
                                product {
                                id
                                legacyResourceId
                                }
                                variant {
                                id
                                legacyResourceId
                                }
                            }
                            }
                        }
                        }
                    }
                    }
                }
                """
            ) {
            bulkOperation {
                id
                status
            }
            userErrors {
                field
                message
            }
            }
        } 
    GRAPHQL

    GET_SUBSCRIPTIONS_IN_BULK = <<-GRAPHQL
        mutation {
            bulkOperationRunQuery(
                query: """{
                    subscriptionContracts {
                        edges {
                            cursor
                            node {
                              id
                              createdAt
                              status
                              nextBillingDate
                              billingPolicy {
                                interval
                                intervalCount
                              }
                              customer {
                                id
                              }
                              lines(first: 5) {
                                edges {
                                  node {
                                    sku
                                  }
                                }
                              }
                              orders(first: 15, reverse: true) {
                                edges {
                                  node {
                                    id
                                    createdAt
                                    transactions {
                                      amountSet {
                                        presentmentMoney {
                                          amount
                                        }
                                      }
                                      status
                                    }
                                    totalPriceSet {
                                      presentmentMoney {
                                        amount
                                      }
                                    }
                                    originalTotalPriceSet {
                                      presentmentMoney {
                                        amount
                                      }
                                    }
                                  }
                                }
                              }
                            }
                        }                   
                    }
                }
                """
            ) {
            bulkOperation {
                id
                status
            }
            userErrors {
                field
                message
            }
            }
        } 
    GRAPHQL

    GET_URL_FOR_DATA = <<-GRAPHQL
        query($id: ID!){
            node(id: $id) {
            ... on BulkOperation {
                url
                partialDataUrl
            }
            }
        }
    GRAPHQL

    def get_all_orders
        result = client.query(client.parse(GET_ORDERS_IN_BULK))
    end

    def get_all_subscriptions
        result = client.query(client.parse(GET_SUBSCRIPTIONS_IN_BULK))
    end

    def parse_bulk_operation(shop_id, id)
        result = client.query(client.parse(GET_URL_FOR_DATA), variables: { id: id})
        new_data = parsed_bulk_data(result&.data&.node&.url)
    end

    def get_orders_data(shop_id, id)
        result = client.query(client.parse(GET_URL_FOR_DATA), variables: { id: id})
        
        new_data = parsed_bulk_data(result&.data&.node&.url)
       
        # BulkOperationResponse.find_or_initialize_by(shop_id: shop_id, response_type: "all_orders")&.update(api_raw_data: new_data&.to_json)

    end

    def get_subscriptions_data(shop_id, id)
        result = client.query(client.parse(GET_SUBSCRIPTIONS_IN_BULK), variables: { id: id})
        
        new_data = parsed_bulk_data(result&.data&.node&.url)
       
        BulkOperationResponse.find_or_initialize_by(shop_id: shop_id, response_type: "all_orders")&.update(api_raw_data: new_data&.to_json)

    end

    def parsed_bulk_data(url)
        require 'open-uri'
        source = "#{url}"
        resp = Net::HTTP.get_response(URI.parse(source))
        data = resp&.body
        new_data=[]

        data&.each_line do |line|
            parsed_data = JSON.parse(line)&.deep_transform_keys(&:underscore) rescue nil
            
            new_data.push(parsed_data) if parsed_data.present?
        end
        return new_data
    end

end 