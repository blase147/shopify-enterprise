class SmsService::ResumeService < SmsService::ProcessService
  def initialize(conversation, params, subscriptions_data)
    super()
    @conversation = conversation
    @params = params
    @shared_service = SmsService::SharedService.new(conversation, params)
    @data = subscriptions_data
  end

  def process_message(step)
    error = false
    error_message = 'Invalid Command, Please try again.'
    increase_step = step
    paused_subscriptions = @data[:subscriptions].select{|subscription| subscription.status == 'PAUSED'}
    return { error: error, message: 'You have no paused subscriptions.', increase_step: increase_step } if paused_subscriptions.count.zero?
    case step
    when 1
      if paused_subscriptions.count > 1
        message = @shared_service.all_subscriptions_by_status(@data, 'PAUSED')
      else
        subscription = paused_subscriptions.first
        message = "Are you sure you want to resume your subscription for #{subscription.lines.edges.map{|edge| edge.node.title }.join(', ')} with a next scheduled delivery on the #{subscription.next_billing_date.to_date.strftime("%a, %B %e")}?"
        increase_step = step + 1
        @shared_service.create_sms_message(paused_subscriptions.first.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        message = "Are you sure you want to cancel your subscription for #{subscription.lines.edges.map{|edge| edge.node.title }.join(', ')} with a next scheduled delivery on the #{subscription.next_billing_date.to_date.strftime("%a, %B %e")} ?"
      end
    when 3
      if @params['Body'].downcase == 'yes'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        if subscription_message.present?
          result = SubscriptionContractDeleteService.new(subscription_message.content, nil, false).run 'ACTIVE'
          if result[:error].present?
            error = true
          else
            subscription_id = subscription_message.content
            customer = Customer.find_by(shopify_id: subscription_id)
            subscription = SubscriptionContractService.new(subscription_id).run
            product = subscription.lines.edges.collect{|c| c.node}.first
            note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
            amount = (product.quantity * product.current_price.amount.to_f).round(2).to_s
            description = customer.name+",resumed,"+product.title
            customer.shop.subscription_logs.sms.resume.create(subscription_id: subscription_id,customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id)
            message = 'Thank you, your subscription has been successfully resumed.'
          end
        else
          error = true
        end
      else
        message = @shared_service.all_subscriptions_by_status(@data, 'PAUSED')
        increase_step = 1
      end
    else
      error = true
    end
    { error: error, message: error ? error_message : message, increase_step: increase_step }
  rescue Exception => ex
    { error: true, message: error_message }
  end
end
