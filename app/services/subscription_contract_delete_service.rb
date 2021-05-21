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
      data = result['data']['subscriptionDraftCommit']['contract']
      subscription = SubscriptionContract.find_or_create_by(shopify_id: id)
      subscription.update(cancelled_at: Time.current, shopify_created_at: data['createdAt'], status: 'CANCELLED')
    end
    if status == 'ACTIVE'
      customer = Customer.find_by(shopify_id: @id)
      customer.shop.subscription_logs.restart.create(subscription_id: @id)
    end
    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
