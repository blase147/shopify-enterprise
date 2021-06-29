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

  def get_subscriptions cursor=nil
    query = GET_SUBSCRIPTIONS
    query = query.gsub("first: #{PAGE}", "first: #{PAGE} after: \"#{cursor}\"") if cursor.present?
    result = ShopifyAPIRetry::GraphQL.retry { client.query(client.parse(query)) }
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
      subscriptions.push(data.edges || [])
      has_next_page = data.page_info.has_next_page
      next_cursor = data.edges.last&.cursor
    end
    subscriptions.flatten
  end
end
