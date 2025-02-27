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

  def initialize(id,type=nil,allow_default=true)
    @id = id
    @type = type
    @allow_default= allow_default
  end

  def log_work(subscription)
    customer = CustomerSubscriptionContract.find_by_shopify_id @id
    product_names = subscription.lines.edges.collect{|c| c.node.title}.to_sentence
    note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
    description = customer.name+",edited delivery date of,"+product_names
    if @type == "sms"
      customer.shop.subscription_logs.sms.skip.create(subscription_id: @id, customer_id: customer.id, product_name: product_names, note: note, description: description)
    else
      customer.shop.subscription_logs.skip.create(subscription_id: @id, customer_id: customer.id, product_name: product_names, note: note, description: description)
    end
  end

  def run(params = nil)
    subscription = SubscriptionContractService.new(@id).run
    customer = CustomerSubscriptionContract.find_by(shopify_id: @id)
    skip_billing_offset = subscription.billing_policy.interval_count.send(subscription.billing_policy.interval.downcase)
    if params.present? && params[:billing_date].present?
      skip_billing_date = params[:billing_date].to_date
    else
      # subscription = SubscriptionContractService.new(@id).run
      billing_date = DateTime.parse(subscription.next_billing_date)
      skip_billing_date = billing_date + skip_billing_offset
    end
    log_work(subscription) if @allow_default

    p skip_billing_date
    input = {}
    if customer&.skip_dates&.include?("#{skip_billing_date&.to_date&.cweek&.to_s}")
      while(customer&.skip_dates&.include?("#{skip_billing_date&.to_date&.cweek&.to_s}"))
        skip_billing_date += skip_billing_offset
      end
    end
    input['nextBillingDate'] = skip_billing_date

    id = "gid://shopify/SubscriptionContract/#{@id}"
    result = client.query(client.parse(DELETE_QUERY), variables: { contractId: id } )
    api_data = customer&.api_data
    api_data["next_billing_date"] = skip_billing_date
    customer&.update(api_data: api_data)
    puts "=====++Service=============",result
    p result
    draft_id = result.data.subscription_contract_update.draft.id
    result = SubscriptionDraftsService.new.update draft_id, input
    p result
    result = SubscriptionDraftsService.new.commit draft_id
    
    # customer.shop.subscription_logs.skip.create(subscription_id: @id, customer_id: customer.id)
    p result
    email_notification = customer.shop.setting.email_notifications.find_by_name "Skip Next Order"
    EmailService::Send.new(email_notification).send_email({customer: customer, next_order_date: skip_billing_date}) unless email_notification.nil?
    p result
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end