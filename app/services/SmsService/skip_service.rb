class SmsService::SkipService < SmsService::ProcessService
  def initialize(conversation, params, subscriptions_data)
    super()
    @conversation = conversation
    @params = params
    @shared_service = SmsService::SharedService.new(conversation, params)
    @data = subscriptions_data
    @customer = conversation.customer
    @shop = @customer.shop
  end

  def process_message(step)
    error = false
    error_message = 'Invalid Command, Please try again.'
    increase_step = step
    case step
    when 1
      if @data[:active_subscriptions].count > 1
        message = @shared_service.get_all_subscriptions(@data)
      else
        message_service = SmsService::MessageGenerateService.new(@shop, @customer, @data[:active_subscriptions].first.node,
                          { subscription_charge_date: DateTime.parse(@data[:active_subscriptions].first.node.next_billing_date).strftime("%a, %B %e") })
        message = message_service.content(messages[:confirm])
        increase_step = step + 1
        @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription,
                          { subscription_charge_date: subscription.next_billing_date.strftime("%a, %B %e") })
        message = message_service.content(messages[:confirm])
      end
    when 3
      if @params['Body'].downcase == 'yes' || @params['Body'].downcase == 'y'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        if subscription_message.present?
          subscription = SubscriptionContractService.new(subscription_message.content).run
          result = ScheduleSkipService.new(subscription_message.content).run
          if result[:error].present?
            message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription,
                              { subscription_charge_date: subscription.next_billing_date.to_date.strftime("%a, %B %e") })
            message = message_service.content(messages[:failure])
            error = true
          else
            product_id = subscription.lines.edges.first.node.product_id[/\d+/]
            @shop.sms_logs.skip.create(product_id: product_id, customer_id: @customer.id)
            message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription,
                              { old_charge_date: subscription.next_billing_date.to_date.strftime("%a, %B %e"), subscription_charge_date: next_charge_date(subscription).strftime("%a, %B %e") })
            message = message_service.content(messages[:success])
          end
        else
          error = true
        end
      elsif @params['Body'].downcase == 'no' || @params['Body'].downcase == 'n'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        if subscription_message.present?
          subscription = SubscriptionContractService.new(subscription_message.content).run
          message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription,
                            { subscription_charge_date: subscription.next_billing_date.to_date.strftime("%a, %B %e") })
          message = message_service.content(messages[:cancel])
        else
          error = true
        end
      else
        message_service = SmsService::MessageGenerateService.new(@shop, @customer, nil)
        error_message = message_service.content(messages[:invalid_options])
        error = true
      end
    else
      error = true
    end
    { error: error, message: error ? error_message : message, increase_step: increase_step }
  rescue Exception => ex
    puts ex.message
    { error: true, message: error_message }
  end

  def messages
    {
      cancel: 'Skip Order - Cancel',
      failure: 'Skip Order - Failure',
      invalid_options: 'Skip Order - Invalid Option',
      success: 'Skip Order - Success',
      confirm: 'Skip Order - Confirm'
    }
  end

  def next_charge_date(subscription)
    billing_date = DateTime.parse(subscription.next_billing_date)
    skip_billing_offset = subscription.billing_policy.interval_count.send(subscription.billing_policy.interval.downcase)
    billing_date + skip_billing_offset
  end
end
