class SubscriptionContractDeleteService < GraphqlService
  DELETE_QUERY = <<-GRAPHQL
    mutation($contractId: ID!) {
      subscriptionContractUpdate(contractId: $contractId) {
        draft {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  GRAPHQL

  def initialize(id)
    @id = id
  end

  def run(status='CANCELLED')
    input = {
      status: status
    }
    id = "gid://shopify/SubscriptionContract/#{@id}"
    result = client.query(client.parse(DELETE_QUERY), variables: { contractId: id } )
    p result
    draft_id = result.data.subscription_contract_update.draft.id
    result = SubscriptionDraftsService.new.update draft_id, input
    result = SubscriptionDraftsService.new.commit draft_id
    if status == 'CANCELLED' && result['data'].present?
      customer = Customer.find_by(shopify_id: @id)
      customer.update(cancelled_at: Time.current)
    end
    if status == 'ACTIVE' && result['data'].present?
      customer = Customer.find_by(shopify_id: @id)
      customer.update(cancelled_at: nil)
      customer.shop.subscription_logs.restart.create(subscription_id: @id, customer_id: customer.id)
    end
    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
