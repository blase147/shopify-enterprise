class CustomerSubscriptionContractsService < GraphqlService
  PAGE = 10

  LIST_QUERY = <<-GRAPHQL
    query($id: ID!){
      customer(id: $id) {
        id
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
              }
              lines(first: 10) {
                edges {
                  node {
                    title
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
    }
  GRAPHQL

  def initialize customer_id
    @customer_id = customer_id
  end

  def run cursor=nil
    query = LIST_QUERY
    query = query.gsub("first: #{PAGE}", "first: #{PAGE} after: \"#{cursor}\"") if cursor.present?
    result = client.query(client.parse(query), variables: { id:  @customer_id })

    data = result.data.customer
    subscriptions = data.subscription_contracts.edges.map do |edge|
      edge
    end

    return {
      subscriptions: subscriptions.map(&:node),
      has_next_page: data.subscription_contracts.page_info.has_next_page,
      has_previous_page: data.subscription_contracts.page_info.has_previous_page,
      next_cursor: subscriptions.last.cursor,
      prev_cursort: subscriptions.first.cursor
    }

  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end