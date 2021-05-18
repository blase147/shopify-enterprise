class SmsService::RestartService < SmsService::ProcessService
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
    cancelled_subscriptions = @data[:subscriptions].select{|subscription| subscription.status == 'CANCELLED'}
    return { error: error, message: 'You have no cancelled subscription.', increase_step: increase_step } if cancelled_subscriptions.count.zero?

    case step
    when 1
      if @data[:cancelled_subscriptions].count > 1
        message = @shared_service.all_subscriptions_by_status(@data, 'CANCELLED')
      else
        subscription = @data[:cancelled_subscriptions].first.node
        message = "Are you sure you want to active your subscription for #{subscription.lines.edges.map{|edge| edge.node.title }.join(', ')} with a next scheduled delivery on the #{subscription.next_billing_date.to_date.strftime("%a, %B %e")}?"
        increase_step = step + 1
        @shared_service.create_sms_message(@data[:cancelled_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        message = "Are you sure you want to active your subscription for #{subscription.lines.edges.map{|edge| edge.node.title }.join(', ')} with a next scheduled delivery on the #{subscription.next_billing_date.to_date.strftime("%a, %B %e")}?"
      end
    when 3
      if @params['Body'].downcase == 'yes'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        if subscription_message.present?
          result = SubscriptionContractDeleteService.new(subscription_message.content).run 'ACTIVE'
          if result[:error].present?
            error = true
          else
            message = 'Thank you, your subscription has been successfully active, you can cancel your subscription at any time by texting the keyword CLOSE.'
          end
        else
          error = true
        end
      else
        message = @shared_service.all_subscriptions_by_status(@data, 'CANCELLED')
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
