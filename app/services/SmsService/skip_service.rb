class SmsService::SkipService < SmsService::ProcessService
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
    case step
    when 1
      if @data[:active_subscriptions].count > 1
        message = @shared_service.get_all_subscriptions(@data)
      else
        message = "Your next delivery date is #{DateTime.parse(@data[:active_subscriptions].first.node.next_billing_date).strftime("%a, %B %e")}, Reply with 'yes' if you want to skip?"
        increase_step = step + 1
        @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        message = "Your next delivery date is #{DateTime.parse(subscription.next_billing_date).strftime("%a, %B %e")}, Reply with 'yes' if you want to skip?"
      end
    when 3
      if @params['Body'].downcase == 'yes'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        if subscription_message.present?
          result = ScheduleSkipService.new(subscription_message.content).run
          if result[:error].present?
            error = true
          else
            message = 'Subscription is skiped.'
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
end
