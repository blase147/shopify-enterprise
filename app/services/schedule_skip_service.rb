class ScheduleSkipService < GraphqlService
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

  def run(params = nil)
    if params.present? && params[:billing_date].present?
      skip_billing_date = params[:billing_date].to_date
    else
      subscription = SubscriptionContractService.new(@id).run
      billing_date = DateTime.parse(subscription.next_billing_date)
      skip_billing_offset = subscription.billing_policy.interval_count.send(subscription.billing_policy.interval.downcase)
      skip_billing_date = billing_date + skip_billing_offset
    end

    p skip_billing_date
    input = {}
    input['nextBillingDate'] = skip_billing_date

    id = "gid://shopify/SubscriptionContract/#{@id}"
    result = client.query(client.parse(DELETE_QUERY), variables: { contractId: id } )
    p result
    draft_id = result.data.subscription_contract_update.draft.id
    result = SubscriptionDraftsService.new.update draft_id, input
    p result
    result = SubscriptionDraftsService.new.commit draft_id
    customer = Customer.find_by(shopify_id: @id)
    customer.shop.subscription_logs.skip.create(subscription_id: @id, customer_id: customer.id)
    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
