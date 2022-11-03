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

  GET_BILLING_ATTEMPT = <<-GRAPHQL
    query($id: ID!){
      subscriptionBillingAttempt(id: $id) {
        id
        order {
          id
        }
        ready
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
    errors =  result.data.subscription_billing_attempt_create.nil? ? result.original_hash["errors"][0]["message"] : 
              result.data.subscription_billing_attempt_create.subscription_billing_attempt.error_message.present? ? 
              result.data.subscription_billing_attempt_create.subscription_billing_attempt.error_message : 
              result.data.subscription_billing_attempt_create.subscription_billing_attempt.order.nil? ? "No order is returned" : nil

    raise errors if errors.present?

    return { error: nil, data: result.data.subscription_billing_attempt_create.subscription_billing_attempt }
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def get_attempt(id)
    result = client.query(client.parse(GET_BILLING_ATTEMPT), variables: { id: id })

    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
