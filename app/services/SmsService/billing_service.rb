class SmsService::BillingService < SmsService::ProcessService

  def initialize(conversation, params, subscriptions_data, customer)
    super()
    @conversation = conversation
    @params = params
    @shared_service = SmsService::SharedService.new(conversation, params)
    @data = subscriptions_data
    @customer = customer
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
        result = CardUpdateService.new(@data[:active_subscriptions].first.node.id[/\d+/]).run
        if result.is_a?(Hash)
          error = true
        else
          message_service = SmsService::MessageGenerateService.new(@customer.shop, @customer, @data[:active_subscriptions].first.node)
          message = message_service.content(messages[:billing_info])
          increase_step = step + 1
        end
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        result = CardUpdateService.new(subscription.id[/\d+/]).run
        if result.is_a?(Hash)
          error = true
        else
          message_service = SmsService::MessageGenerateService.new(@customer.shop, @customer, subscription)
          message = message_service.content(messages[:billing_info])
        end
      end
    else
      error = true
    end
    { error: error, message: error ? error_message : message, increase_step: increase_step }
  rescue Exception => ex
    { error: true, message: error_message }
  end

  def messages
    {
      billing_info: 'Modify Order - Billing Info'
    }
  end
end
