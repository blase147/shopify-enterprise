class SubscriptionBillingAttempService < GraphqlService
  CREATE_QUERY = <<-GRAPHQL
    mutation ($subscription_contract_id: ID!, $key: String!){
      subscriptionBillingAttemptCreate(
        subscriptionContractId: $subscription_contract_id
        subscriptionBillingAttemptInput: { idempotencyKey: $key }
      ) {
        subscriptionBillingAttempt {
          id
          errorMessage
          nextActionUrl
          order {
            id
          }
          ready
        }
      }
    }
  GRAPHQL

  def initialize subscription_id
    @subscription_id = subscription_id
  end

  def run
    result = client.query(client.parse(CREATE_QUERY), variables: {
      subscription_contract_id: @subscription_id,
      key: Time.current.to_i.to_s
    })

    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
