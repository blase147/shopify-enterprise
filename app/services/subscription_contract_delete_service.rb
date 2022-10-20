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

  def initialize(id,type=nil,allow_default=true,customer_type=nil)
    @id = id
    @type = type
    @allow_default= allow_default
    @customer_type = customer_type
  end

  def log_work(customer, status)
    begin
      subscription = SubscriptionContractService.new(@id).run
      product = subscription.lines.edges.collect{|c| c.node}.first
      note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
      amount = (product.quantity * product.current_price.amount.to_f).round(2).to_s
      if status == "CANCELLED"
        description = customer.name+",canceled,"+product.title
        if @type == "sms"
          customer.shop.subscription_logs.sms.cancel.create(subscription_id: @id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id, action_by: @customer_type)
        else
          customer.shop.subscription_logs.cancel.create(subscription_id: @id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id, action_by: @customer_type)
        end
      elsif status == "PAUSED"
        description = customer.name+",paused,"+product.title
        if @type == "sms"
          customer.shop.subscription_logs.sms.restart.create(subscription_id: @id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id, action_by: @customer_type, action_type: "pause")
        else
          customer.shop.subscription_logs.restart.create(subscription_id: @id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id, action_by: @customer_type, action_type: "pause")
        end
      elsif status == "RESUMED"
        description = customer.name+",resumed,"+product.title
        if @type == "sms"
          customer.shop.subscription_logs.sms.restart.create(subscription_id: @id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id, action_by: @customer_type)
        else
          customer.shop.subscription_logs.restart.create(subscription_id: @id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id, action_by: @customer_type)
        end
      else
        description = customer.name+",restarted,"+product.title
        if @type == "sms"
          customer.shop.subscription_logs.sms.restart.create(subscription_id: @id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id, action_by: @customer_type)
        else
          customer.shop.subscription_logs.restart.create(subscription_id: @id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id, action_by: @customer_type)
        end
      end
    rescue
      true
    end
  end

  def run(status='CANCELLED')
    @status_type = status
    if status === 'RESUMED'
      status = 'ACTIVE'
    end
    input = {
      status: status
    }
    id = if @id.include? 'SubscriptionContract'
      @id
    else
      "gid://shopify/SubscriptionContract/#{@id}"
    end
    result = client.query(client.parse(DELETE_QUERY), variables: { contractId: id } )
    p result
    draft_id = result.data.subscription_contract_update.draft.id
    result = SubscriptionDraftsService.new.update draft_id, input
    result = SubscriptionDraftsService.new.commit draft_id
    customer = CustomerSubscriptionContract.find_by(shopify_id: @id)
    if status == 'CANCELLED' && result['data'].present?
      customer.cancelled_at = Time.current
    end
    if status == 'ACTIVE' && result['data'].present?
      customer.cancelled_at = nil
    end
    customer.status =  status
    customer.api_data = SubscriptionContractService.new(id).run.to_h.deep_transform_keys { |key| key.underscore }
    customer.save
    @status_type
    log_work(customer, @status_type) if @allow_default
    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
