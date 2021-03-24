class SubscriptionContractUpdateService < GraphqlService
  GET_QUERY = <<-GRAPHQL
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

  def run params
    result = client.query(client.parse(GET_QUERY), variables: { contractId: @id} )
    draft_id = result.data.subscription_contract_update.draft.id
    if params[:next_billing_date].present?
      input = { }
      input['nextBillingDate'] = DateTime.parse(params[:next_billing_date])
      result = SubscriptionDraftsService.new.update draft_id, input
      raise result[:error] if result[:error].present?
    end

    if params[:quantity].present?
      subscription = SubscriptionContractService.new(@id[/\d+/]).run
      line_id = subscription.lines.edges.first.node.id
      line_input = {}
      line_input['quantity'] = params[:quantity].to_i

      result = SubscriptionDraftsService.new.line_update draft_id, line_id, line_input
      raise result[:error] if result[:error].present?
    end

    result = SubscriptionDraftsService.new.commit draft_id
    raise result[:error] if result[:error].present?
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def get_draft params
    result = client.query(client.parse(GET_QUERY), variables: { contractId: @id} )
    draft_id = result.data.subscription_contract_update.draft.id
    { draft_id: draft_id }
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
