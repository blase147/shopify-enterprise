class ShpoifyBulkOperation  < GraphqlService
    GET_ORDERS_IN_BULK = <<-GRAPHQL
        mutation {
            bulkOperationRunQuery(
                query: """
                    {
                    orders(query: "status:any") {
                    edges {
                        node {
                        id
                        legacyResourceId
                        createdAt
                        cancelledAt
                        name
                        refunds {
                            id
                            totalRefundedSet{
                                presentmentMoney{
                                    amount
                                    currencyCode
                                }
                                shopMoney{
                                    amount
                                    currencyCode
                                }
                            }
                        }
                        channel {
                            app {
                            id
                            }
                        }
                        totalPrice
                        currentTotalPriceSet{
                            shopMoney{
                                amount
                                currencyCode
                            }
                            presentmentMoney{
                                amount
                                currencyCode
                            }
                        }
                        totalShippingPriceSet {
                            shopMoney{
                                amount
                                currencyCode
                            }
                            presentmentMoney{
                                amount
                                currencyCode
                            }
                        }
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
                              lines {
                                edges {
                                  node {
                                    sku
                                  }
                                }
                              }
                              orders {
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
                                    refunds {
                                        id
                                        totalRefundedSet{
                                            presentmentMoney{
                                                amount
                                                currencyCode
                                            }
                                            shopMoney{
                                                amount
                                                currencyCode
                                            }
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
        url = result&.data&.node&.url
        if url.present? && (url.include?("https://") || url.include?("http://"))
            new_data = parsed_bulk_data(shop_id, url)
        else
            File.write("bulk_operation_log.txt", "url:- #{url} , result:- #{result.data.to_json}", mode: "a")
        end
    end

    def get_orders_data(shop_id, data)
        orders=[]
        skus={}
        first_line = JSON.parse(data.each_line.first)
        return unless first_line["id"]&.include?("Order")
        data&.each_line do |line|
            parsed_data = JSON.parse(line)&.deep_transform_keys(&:underscore) rescue nil
            if parsed_data&.has_key?("__parent_id")
                skus["#{parsed_data["__parent_id"]}"] = [] unless skus["#{parsed_data["__parent_id"]}"].present? 
                skus["#{parsed_data["__parent_id"]}"].push({"node": parsed_data})
            else
                orders.push( parsed_data ) if parsed_data.present?
            end
        end
        orders&.each do |contract|
            contract["lineItems"] = {} 
            contract["lineItems"]["edges"] = skus["#{contract["id"]}"] 
        end
       
        BulkOperationResponse.find_or_initialize_by(shop_id: shop_id, response_type: "all_orders")&.update(api_raw_data: orders&.to_json) if orders.present?

    end

    def get_subscriptions_data(shop_id, data)
        contracts=[]
        edges={}
        skus={}

        first_line = JSON.parse(data.each_line.first)
        return unless first_line["id"]&.include?("SubscriptionContract")
        data&.each_line do |line|
            parsed_data = JSON.parse(line)&.deep_transform_keys(&:underscore) rescue nil
            if parsed_data&.has_key?("__parent_id")
                if parsed_data["id"]&.include?("Order")
                    edges["#{parsed_data["__parent_id"]}"] = [] unless edges["#{parsed_data["__parent_id"]}"].present? 
                    edges["#{parsed_data["__parent_id"]}"].push({"node": parsed_data})
                elsif parsed_data.has_key?("sku")
                    skus["#{parsed_data["__parent_id"]}"] = [] unless skus["#{parsed_data["__parent_id"]}"].present? 
                    skus["#{parsed_data["__parent_id"]}"].push({"node": parsed_data})
                end
            else
                contracts.push({"node": parsed_data}) if parsed_data.present?
            end
        end
        contracts&.each do |contract|
            contract[:node]["orders"]={} 
            contract[:node]["orders"]["edges"] = edges["#{contract[:node]["id"]}"] 
            contract[:node]["lines"] = {} 
            contract[:node]["lines"]["edges"] = skus["#{contract[:node]["id"]}"] 
        end
       
        BulkOperationResponse.find_or_initialize_by(shop_id: shop_id, response_type: "subscriptions")&.update(api_raw_data: contracts&.to_json) if contracts.present?
    end




    def parsed_bulk_data(shop_id, url)
        require 'uri'
		require 'net/http'
		require 'openssl'
        url = URI("#{url}")
        resp = Net::HTTP.get_response(url)
        data = resp&.body
        get_subscriptions_data(shop_id, data)
        get_orders_data(shop_id, data)
        RefreshAnalyticDataWorker.perform_async
    end

end 