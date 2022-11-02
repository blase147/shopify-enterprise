class GetAllCustomersService < GraphqlService
    PAGE = 10
    LIST_CUSTOMER_QUERY = <<-GRAPHQL
   {
      subscriptionContracts(first: #{PAGE}, reverse: true) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            customer {
                id
                displayName
                firstName
                lastName
                email
                phone
                paymentMethods(first: 10) {
                  edges {
                    node {
                      id
                      instrument {
                        ... on CustomerCreditCard {
                          billingAddress {
                            address1
                            city
                            country
                            province
                            zip
                          }
                          expiryMonth
                          expiryYear
                          expiresSoon
                          lastDigits
                          name
                        }
                        ... on CustomerShopPayAgreement {
                          lastDigits
                          expiryMonth
                          expiryYear
                          expiresSoon
                          inactive
                          isRevocable
                          lastDigits
                          maskedNumber
                          name  
                        }
                      }
                    }
                  }
                }
                defaultAddress {
                    id
                    formatted
                    address1
                    address2
                    city
                    country
                    province
                    zip
                }
            }
          }
        }
      }
    }
    GRAPHQL

    def all_customers
        has_next_page = true
        next_cursor = nil
        subscriptions = []
        while has_next_page
        data = customer_run(next_cursor)
        subscriptions.push(data[:subscriptions] || [])
        has_next_page = data[:has_next_page]
        next_cursor = data[:next_cursor]
        end
        return { customers: subscriptions }
    rescue Exception => ex
        p ex.message
        { error: ex.message }
    end

    def customer_run cursor=nil
        query = LIST_CUSTOMER_QUERY
        query = query.gsub("first: #{PAGE}", "first: #{PAGE} after: \"#{cursor}\"") if cursor.present?
        result = client.query(client.parse(query))
    
        puts '###'
        p result
    
        data = result.data.subscription_contracts
        subscriptions = data.edges.map do |edge|
          edge
        end
    
        return {
          subscriptions: subscriptions,
          has_next_page: data.page_info.has_next_page,
          has_previous_page: data.page_info.has_previous_page,
          next_cursor: subscriptions.last.cursor,
          prev_cursort: subscriptions.first.cursor
        }
    
    rescue Exception => ex
        p ex.message
        { error: ex.message }
    end

end