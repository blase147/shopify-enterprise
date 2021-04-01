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

  def initialize id
    @id = id
  end

  def run status='CANCELLED'
    input = {
      status: status
    }
    id = "gid://shopify/SubscriptionContract/#{@id}"

    result = client.query(client.parse(DELETE_QUERY), variables: { contractId: id} )
    p result

    draft_id = result.data.subscription_contract_update.draft.id

    result = SubscriptionDraftsService.new.update draft_id, input
    result = SubscriptionDraftsService.new.commit draft_id
    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
