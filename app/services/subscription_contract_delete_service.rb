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

  def initialize(id, type=nil)
    @id = id
    @type = type
  end

  def log_work(customer, status)
    begin
      subscription = SubscriptionContractService.new(@id).run
      product = subscription.lines.edges.collect{|c| c.node}.first
      note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
      amount = (product.quantity * product.current_price.amount.to_f).round(2).to_s
      if status == "CANCELLED"
        description = customer.name+",just canceled,"+product.title
        if @type == "sms"
          customer.shop.subscription_logs.sms.cancel.create(customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id)
        else
          customer.shop.subscription_logs.cancel.create(customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id)
        end
      else
        description = customer.name+",just restart,"+product.title
        if @type == "sms"
          customer.shop.subscription_logs.sms.restart.create(customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id)
        else
          customer.shop.subscription_logs.restart.create(customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id)
        end
      end
    rescue
      true
    end
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
      log_work(customer, status)
    end
    if status == 'ACTIVE' && result['data'].present?
      customer = Customer.find_by(shopify_id: @id)
      customer.update(cancelled_at: nil)
      # customer.shop.subscription_logs.restart.create(subscription_id: @id, customer_id: customer.id)
      log_work(customer, status)
    end
    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
