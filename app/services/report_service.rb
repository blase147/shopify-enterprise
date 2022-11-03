class ReportService < GraphqlService
  PAGE = 10

  GET_SUBSCRIPTIONS = <<-GRAPHQL
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
  GRAPHQL

  GET_SINGLE_SUBSCRIPTION = <<-GRAPHQL
    query($id: ID!){
        subscriptionContract(id: $id) {
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
                title
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
    GRAPHQL

  def get_subscriptions cursor=nil
    query = GET_SUBSCRIPTIONS
    query = query.gsub("first: #{PAGE}", "first: #{PAGE} after: \"#{cursor}\"") if cursor.present?
    result = ShopifyAPIRetry::GraphQL.retry(:wait => 10, :tries => 5) do
      client.query(client.parse(query))
    end
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"])
    result&.data&.subscription_contracts
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def all_subscriptions
    has_next_page = true
    next_cursor = nil
    subscriptions = []

    while has_next_page
      data = get_subscriptions next_cursor
      subscriptions.push(data&.edges || [])
      has_next_page = data&.page_info&.has_next_page || false
      next_cursor = data&.edges&.last&.cursor
    end
    subscriptions.flatten
  end

  def get_single_subscriptions id
    id = "gid://shopify/SubscriptionContract/#{id}"
    result = client.query(client.parse(GET_SINGLE_SUBSCRIPTION), variables: { id: id } )
    result&.data&.subscription_contract
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
