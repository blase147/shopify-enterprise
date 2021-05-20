class SmsService::DelayService < SmsService::ProcessService
  def initialize(conversation, params, subscriptions_data)
    super()
    @conversation = conversation
    @params = params
    @shared_service = SmsService::SharedService.new(conversation, params)
    @data = subscriptions_data
    @customer = customer
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
        message_service = SmsService::MessageGenerateService.new(@shop, @customer, @data[:active_subscriptions].first.node)
        message = message_service.content(messages[:options])
        increase_step = step + 1
        @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription)
        message = message_service.content(messages[:options])
      end
    when 3
      subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
      if subscription_message.present?
        subscription = SubscriptionContractService.new(subscription_message.content).run
        if subscription.is_a?(Hash)
          error = true
        else
          next_schedule_date = get_next_date(@params['Body'], subscription.next_billing_date.to_date)
          if next_schedule_date == false
            error = true
            message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription)
            error_message = message_service.content(messages[:invalid_options])
          else
            message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription,
                              { subscription_charge_date: next_schedule_date.to_date.strftime("%a, %B %e") })
            message = message_service.content(messages[:confirm])
          end
        end
      else
        error = true
      end
    when 4
      if @params['Body'].downcase == 'yes' || @params['Body'].downcase == 'y'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        next_schedule_date_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
        if subscription_message.present?
          subscription = SubscriptionContractService.new(subscription_message.content).run
          if subscription.is_a?(Hash)
            error = true
          else
            next_schedule_date = get_next_date(next_schedule_date_message.content, subscription.next_billing_date.to_date)
            result = ScheduleSkipService.new(subscription.id[/\d+/]).run({ billing_date: next_schedule_date })
            if result[:error].present?
              message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription, { subscription_charge_date: next_schedule_date.to_date.strftime("%a, %B %e") })
              message = message_service.content(messages[:failure])
            else
              product_id = subscription.lines.edges.first.node.variant_id[/\d+/]
              @shop.sms_logs.delay.create(product_id: product_id, customer_id: @customer.id)
              message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription,
                                { delay_weeks: no_of_weeks[next_schedule_date_message.content], subscription_charge_date: next_schedule_date.to_date.strftime("%a, %B %e") })
              message = message_service.content(messages[:success])
            end
          end
        else
          error = true
        end
      else
        message = @shared_service.get_all_subscriptions(@data)
        increase_step = 1
      end
    else
      error = true
    end
    { error: error, message: error ? error_message : message, increase_step: increase_step }
  rescue Exception => ex
    { error: true, message: error_message }
  end

  def get_next_date(option, date)
    case option.downcase
    when '1w'
      date + 1.weeks
    when '2w'
      date + 2.weeks
    when '3w'
      date + 3.weeks
    else
      false
    end
  end

  def no_of_weeks
    {
      "1w" => '1',
      "2w" => '2',
      "3w" => '3'
    }
  end

  def messages
    {
      options: 'Delay Order - Options',
      failure: 'Delay Order - Failure',
      invalid_options: 'Delay Order - Invalid Option',
      success: 'Delay Order - Success',
      confirm: 'Delay Order - Confirm'
    }
  end
end
