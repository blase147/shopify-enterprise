class SmsService::CancelService < SmsService::ProcessService
  def initialize(conversation, params, subscriptions_data, customer)
    super()
    @conversation = conversation
    @params = params
    @shared_service = SmsService::SharedService.new(conversation, params)
    @data = subscriptions_data
    @customer = customer
    @shop = @shop
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
        message = message_service.content(messages[:cancellation_reasons])
        increase_step = step + 1
        @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription)
        message = message_service.content(messages[:cancellation_reasons])
      end
    when 3
      reason = @params['Body'].downcase
      smarty_cancellation_reason = @shop.smarty_cancellation_reasons.where('name ILIKE ?', reason).last
      if smarty_cancellation_reason.present? && !smarty_cancellation_reason.not_defined? && @shop.sms_setting&.winback_flow
        message_service = SmsService::MessageGenerateService.new(@shop, @customer, nil)
        message = message_service.content(messages["#{smarty_cancellation_reason.winback}_winback".to_sym])
      else
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        subscription = SubscriptionContractService.new(subscription_message.content).run
        if subscription.is_a?(Hash)
          error = true
        else
          message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription)
          message = message_service.content(messages[:confirmation])
          increase_step = step + 1
        end
      end
    when 4
      if @params['Body'].downcase == 'continue'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        subscription = SubscriptionContractService.new(subscription_message.content).run
        if subscription.is_a?(Hash)
          error = true
        else
          message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription)
          message = message_service.content(messages[:confirmation])
        end
      else
        error = true
      end
    when 5
      if @params['Body'].downcase == 'yes' || @params['Body'].downcase == 'y'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        if subscription_message.present?
          subscription = SubscriptionContractService.new(subscription_message.content).run
          result = SubscriptionContractDeleteService.new(subscription_message.content).run 'CANCELLED'
          if result[:error].present?
            error = true
            message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription)
            error_message = message_service.content(messages[:failure])
          else
            product_id = subscription.lines.edges.first.node.product_id[/\d+/]
            # @shop.sms_logs.cancel.create(product_id: product_id, customer_id: @customer.id)
            @shop.subscription_logs.cancel.sms.create(product_id: product_id, customer_id: @customer.id)
            message_service = SmsService::MessageGenerateService.new(@shop, @customer, subscription)
            message = message_service.content(messages[:success])
          end
        else
          error = true
        end
      elsif @params['Body'].downcase == 'no' || @params['Body'].downcase == 'n'
        message_service = SmsService::MessageGenerateService.new(@shop, @customer, nil)
        message = message_service.content(messages[:cancel])
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
    { error: true, message: error_message }
  end

  def messages
    {
      confirmation: 'End Subscription - confirmation',
      cancel: 'End Subscription - Cancel',
      cancellation_reasons: 'End Subscription - Cancellation Reason',
      invalid_options: 'End Subscription - invalid option',
      swap_winback: 'End Subscription - Winback Swap',
      skip_winback: 'End Subscription - Winback Skip',
      success: 'End Subscription - Success',
      failure: 'End Subscription - Failure',
      contact: 'End Subscription - Contact' #not using for now
    }
  end
end
