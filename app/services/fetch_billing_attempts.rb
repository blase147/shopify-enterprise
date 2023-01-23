class FetchBillingAttempts < GraphqlService

	GET_QUERY = <<-GRAPHQL
    query($id: ID!){
      subscriptionContract(id: $id) {
        id
        createdAt
        updatedAt
        status
        nextBillingDate
        appAdminUrl
        billingAttempts(first: 25, reverse: true){
          edges{
            node{
              createdAt
              errorCode
              errorMessage
              id
              nextActionUrl
            }
          }
        }
      }
    }
  GRAPHQL

  def initialize id
    @id = id
  end

  def run
    id = if @id.is_a?(String) && @id.include?('SubscriptionContract')
      @id
    else
      "gid://shopify/SubscriptionContract/#{@id}"
    end

    result = ShopifyAPIRetry::GraphQL.retry { client.query(client.parse(GET_QUERY), variables: { id: id} ) }
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
    result.data.subscription_contract.billing_attempts
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
