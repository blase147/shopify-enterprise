class ReportService < GraphqlService
  PAGE = 10

  GET_SUBSCRIPTIONS = <<-GRAPHQL
   {
      subscriptionContracts(first: #{PAGE}, reverse: true) {
        edges {
          node {
            createdAt
            status
            customer {
              id
              productSubscriberStatus
            }
            lines(first: 20) {
              edges
            }
            orders(first: 30, reverse: true) {
              edges {
                node {
                  createdAt
                  totalPriceSet {
                    presentmentMoney {
                      amount
                    }
                  }
                  totalRefundedSet {
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

  def get_subscriptions
    result = client.query(client.parse(GET_SUBSCRIPTIONS))
    result&.data&.subscription_contracts&.edges
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
