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
        customer = CustomerService.new({shop: @customer.shop}).find(@customer.shopify_id)
        customer_detail = "Name: #{customer.first_name} #{customer.last_name}/nCompany: #{customer.company.present? ? customer.company : '-'}/nAddress: #{customer.address_1.present? ? customer.address_1 : '-'}"
        message = customer_detail + '/nDo you want to change your billing informations?'
        increase_step = step + 1
        @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      else
        customer = CustomerService.new({shop: @customer.shop}).find(@customer.shopify_id)
        customer_detail = "Name: #{customer.first_name} #{customer.last_name}/nCompany: #{customer.company.present? ? customer.company : '-'}/nAddress: #{customer.address_1.present? ? customer.address_1 : '-'}"
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
      message = 'Please enter your company name if appropriate or respond with none'
    when 5
      message = "Please enter your full address in this format : 'street house_number zip_code country'"
    when 6
      name_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
      company_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 5).last
      address_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 6).last
      customer_data = "Name: #{name_message.content}/nCompany: #{company_message.content}/nAddress: #{address_message.content}"
      message = customer_data + '/nAre you sure you want to apply those changes?'
    when 7
      if @params['Body'].downcase == 'yes'
        name_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
        company_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 5).last
        address_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 6).last
        first_name, last_name = name_message.content.split(' ')
        company = company_message.content == 'none' ? nil : company_message.content
        result = CustomerService.new({ shop: @customer.shop }).update_address({id: "gid://shopify/Customer/#{@customer.shopify_id}", address: {first_name: first_name, last_name: last_name, company: company, address_1: address_message.content}})
        if result.is_a?(Hash)
          error = true
        else
          message = 'Billing updated susccessfully'
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
