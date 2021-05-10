class SmsService::QuantityService < SmsService::ProcessService
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
        subscription = @data[:active_subscriptions].first.node
        @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
        if subscription.lines.edges.count > 1
          increase_step = step + 1
          message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription)
          message = message_service.content(messages[:conditional])
        else
          message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription, {line_item_name: subscription.lines.edges.first.node.title})
          message = message_service.content(messages[:conditional_response])
          increase_step = step + 2
          @shared_service.create_sms_message(subscription.lines.edges.first&.node&.id&.split("gid://shopify/SubscriptionLine/")[1], increase_step, comes_from_customer: true)
        end
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        if subscription.lines.edges.count > 1
          message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription)
          message = message_service.content(messages[:conditional])
        else
          message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription, {line_item_name: subscription.lines.edges.first.node.title})
          message = message_service.content(messages[:conditional_response])
          increase_step = step + 1
          @shared_service.create_sms_message(subscription.lines.edges.first&.node&.id&.split("gid://shopify/SubscriptionLine/")[1], increase_step, comes_from_customer: true)
        end
      end
    when 3
      subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
      lines_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
      subscription = SubscriptionContractService.new(subscription_message.content).run
      line = subscription.lines.edges.select{ |line| line.node.id == "gid://shopify/SubscriptionLine/#{lines_message.content.downcase}" }
      if line.present?
        message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription, {line_item_name: line.first.node.title})
        message = message_service.content(messages[:conditional_response])
      else
        error = true
        message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription)
        error_message = message_service.content(messages[:conditional_response_failure])
      end
    when 4
      subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
      lines_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
      subscription = SubscriptionContractService.new(subscription_message.content).run
      if subscription.is_a?(Hash)
        error = true
      else
        line = subscription.lines.edges.select{ |line| line.node.id == "gid://shopify/SubscriptionLine/#{lines_message.content.downcase}" }
        if @params['Body'].to_i > 0 && @params['Body'].to_i < 10000
          message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription, {line_item_name: line.first.node.title, line_item_qty: @params['Body'].to_i})
          message = message_service.content(messages[:confirm])
        else
          error = true
        end
      end
    when 5
      if @params['Body'].downcase == 'yes' || @params['Body'].downcase == 'y'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        lines_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
        quantity_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
        if subscription_message.present? && lines_message.present?
          subscription = SubscriptionContractService.new(subscription_message.content[/\d+/]).run
          if subscription.is_a?(Hash)
            error = true
            message = 'Invalid ID, Please Try Again'
          else
            line = subscription.lines.edges.select{ |line| line.node.id == "gid://shopify/SubscriptionLine/#{lines_message.content.downcase}" }
            draft_id = @shared_service.subscription_draft(subscription.id)
            SubscriptionDraftsService.new.line_update(draft_id, "gid://shopify/SubscriptionLine/#{lines_message.content.downcase}", { quantity: quantity_message.content.to_i })
            result = SubscriptionDraftsService.new.commit draft_id
            if result[:error].present?
              error = true
              message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription, {line_item_qty: quantity_message.content.to_i})
              error_message = message_service.content(messages[:failure])
            else
              message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription, {line_item_name: line.first.node.title, line_item_qty: quantity_message.content.to_i})
              message = message_service.content(messages[:success])
            end
          end
        else
          error = true
        end
      elsif @params['Body'].downcase == 'no' || @params['Body'].downcase == 'n'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        subscription = SubscriptionContractService.new(subscription_message.content[/\d+/]).run
        lines_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
        line = subscription.lines.edges.select{ |line| line.node.id == "gid://shopify/SubscriptionLine/#{lines_message.content.downcase}" }
        message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, subscription, {line_item_name: line.first.node.title, line_item_qty: line.first.node.quantity})
        message = message_service.content(messages[:cancel])
      else
        message_service = SmsService::MessageGenerateService.new(@conversation.customer.shop, @conversation.customer, nil)
        error_message = message_service.content(messages[:invalid_options])
        error = true
      end
    else
      message = @shared_service.get_all_subscriptions(@data)
      increase_step = 1
    end
    { error: error, message: error ? error_message : message, increase_step: increase_step }
  rescue Exception => ex
    { error: true, message: error_message }
  end

  def messages
    {
      cancel: 'Edit quantity - Cancel',
      confirm: 'Edit quantity - Confirm',
      conditional: 'Edit quantity - Conditional',
      conditional_response: 'Edit quantity - conditional_response',
      conditional_response_failure: 'Edit quantity - conditional_response_failure',
      success: 'Edit quantity - Success',
      failure: 'Edit quantity - failure',
      invalid_options: 'Edit quantity- Invalid Option'
    }
  end
end
