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
          message = subscription.lines.edges.each_with_index.map{|line, i| "#{i+1}. #{line.node.id.split("gid://shopify/SubscriptionLine/")[1]} #{line.node.title}"}.join('/n')
        else
          message = 'Please Reply with required quantity'
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
          message = subscription.lines.edges.each_with_index.map{|line, i| "#{i+1}. #{line.node.id.split("gid://shopify/SubscriptionLine/")[1]} #{line.node.title}"}.join('/n')
        else
          message = 'Please Reply with required quantity'
          increase_step = step + 1
          @shared_service.create_sms_message(subscription.lines.edges.first&.node&.id&.split("gid://shopify/SubscriptionLine/")[1], increase_step, comes_from_customer: true)
        end
      end
    when 3
      message = 'Please Reply with required quantity'
    when 4
      subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
      lines_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
      subscription = SubscriptionContractService.new(subscription_message.content).run
      if subscription.is_a?(Hash)
        error = true
      else
        line = subscription.lines.edges.select{ |line| line.node.id == "gid://shopify/SubscriptionLine/#{lines_message.content.downcase}" }
        if @params['Body'].to_i > 0 && @params['Body'].to_i < 10000
          message = "You would receive #{@params['Body'].to_i} #{line.first.node.title} on every order for a total of #{(line.first.node.current_price.amount.to_f * @params['Body'].to_i).round(2)}$, do you confirm the new total?"
        else
          error = true
        end
      end
    when 5
      if @params['Body'].downcase == 'yes'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        lines_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
        quantity_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
        if subscription_message.present? && lines_message.present?
          subscription = SubscriptionContractService.new(subscription_message.content[/\d+/]).run
          if subscription.is_a?(Hash)
            error = true
            message = 'Invalid ID, Please Try Again'
          else
            draft_id = @shared_service.subscription_draft(subscription.id)
            SubscriptionDraftsService.new.line_update(draft_id, "gid://shopify/SubscriptionLine/#{lines_message.content.downcase}", { quantity: quantity_message.content.to_i })
            result = SubscriptionDraftsService.new.commit draft_id
            if result[:error].present?
              error = true
            else
              message = "Product quantity updated successfully."
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
      message = @shared_service.get_all_subscriptions(@data)
      increase_step = 1
    end
    { error: error, message: error ? error_message : message, increase_step: increase_step }
  rescue Exception => ex
    { error: true, message: error_message }
  end

  def get_next_date(option, date)
    case option.downcase
    when '2w'
      date + 2.weeks
    when '1m'
      date + 1.month
    when '6w'
      date + 6.weeks
    else
      false
    end
  end
end
