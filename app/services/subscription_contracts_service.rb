class SubscriptionContractsService < GraphqlService
  PAGE = 10

  LIST_QUERY = <<-GRAPHQL
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
            appAdminUrl
            customer {
              firstName
              lastName
              email
            }
            lines(first: 10) {
              edges {
                node {
                  title
                  currentPrice {
                    amount
                  }
                }
              }
            }
            orders(first: 10, reverse: true) {
              edges {
                node {
                  id
                  totalReceivedSet {
                    presentmentMoney {
                      amount
                    }
                  }
                }
              }
            }
            billingPolicy {
              interval
              intervalCount
            }
          }
        }
      }
    }
  GRAPHQL
  
  def run cursor=nil
    query = LIST_QUERY
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