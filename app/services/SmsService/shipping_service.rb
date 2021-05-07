class SmsService::ShippingService < SmsService::ProcessService
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
        address = @data[:active_subscriptions].first.node.delivery_method.address
        customer_detail = "Name: #{address.first_name} #{address.last_name}/nAddress: #{address.address1.present? ? address.address1 : '-'}"
        message = customer_detail + '/nDo you want to change your shipping informations?'
        increase_step = step + 1
        @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        customer_subscription = @data[:active_subscriptions].select{ |sub| sub.node.id == subscription.id }
        address = customer_subscription.first.node.delivery_method.address
        customer_detail = "Name: #{address.first_name} #{address.last_name}/nAddress: #{address.address1.present? ? address.address1 : '-'}"
        message = customer_detail + '/nDo you want to change your billing informations?'
      end
    when 3
      if @params['Body'].downcase == 'yes'
        message = "Please enter your name"
      else
        message = @shared_service.get_all_subscriptions(@data)
        increase_step = 1
      end
    when 4
      message = "Please enter your full address in this format : 'street house_number zip_code country'"
    when 5
      name_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
      address_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 5).last
      customer_data = "Name: #{name_message.content}/nAddress: #{address_message.content}"
      message = customer_data + '/nAre you sure you want to apply those changes?'
    when 6
      if @params['Body'].downcase == 'yes'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        customer_subscription = @data[:active_subscriptions].select{ |sub| sub.node.id == @shared_service.subscription_shopify_id(subscription_message.content) }
        address = customer_subscription.first.node.delivery_method.address
        name_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
        address_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 5).last
        first_name, last_name = name_message.content.split(' ')
        input = { deliveryMethod: { shipping: {address: { firstName: first_name, lastName: last_name, address1: address_message.content, country: address.country,
                                                          zip: address.zip, province: address.province, city: address.city } } } }
        draft_id = @shared_service.subscription_draft(@shared_service.subscription_shopify_id(subscription_message.content))
        result = SubscriptionDraftsService.new.update draft_id, input
        SubscriptionDraftsService.new.commit draft_id
        if result[:error].present?
          error = true
        else
          message = 'Shipping information updated successfully'
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
