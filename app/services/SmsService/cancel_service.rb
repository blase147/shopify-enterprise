class SmsService::CancelService < SmsService::ProcessService
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
    smarty_cancellation_reasons = @customer.shop.smarty_cancellation_reasons
    case step
    when 1
      if @data[:active_subscriptions].count > 1
        message = @shared_service.get_all_subscriptions(@data)
      else
        message = "Can you tell why you're cancelling?/n" + smarty_cancellation_reasons.map{|reason| "#{reason.name}"}.join('/n')
        increase_step = step + 1
        @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        message = "Can you tell why you're cancelling?/n" + smarty_cancellation_reasons.map{|reason| "#{reason.name}"}.join('/n')
      end
    when 3
      reason = @params['Body'].downcase
      smarty_cancellation_reason = @customer.shop.smarty_cancellation_reasons.where('name ILIKE ?', reason).last
      if smarty_cancellation_reason.present? && !smarty_cancellation_reason.not_defined?
        message = "Do you want to #{smarty_cancellation_reason.winback.upcase} a product for your current subscription (#{smarty_cancellation_reason.winback.upcase}) or continue with the cancellation of your subscription (CONTINUE) ?"
      else
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        subscription = SubscriptionContractService.new(subscription_message.content).run
        if subscription.is_a?(Hash)
          error = true
        else
          message = "Are you sure you want to cancel your subscription for #{subscription.lines.edges.map{|edge| edge.node.title}.join(', ')} with a next scheduled delivery on the #{subscription.next_billing_date.to_date.strftime("%a, %B %e")}?"
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
          message = "Are you sure you want to cancel your subscription for #{subscription.lines.edges.map{|edge| edge.node.title}.join(', ')} with a next scheduled delivery on the #{subscription.next_billing_date.to_date.strftime("%a, %B %e")}?"
        end
      else
        error = true
      end
    when 5
      if @params['Body'].downcase == 'yes'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        if subscription_message.present?
          result = SubscriptionContractDeleteService.new(subscription_message.content).run 'CANCELLED'
          if result[:error].present?
            error = true
          else
            message = 'Thank you, your subscription has been successfully cancelled'
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
