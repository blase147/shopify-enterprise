class ProcessSmsService
  def initialize(conversation, params, customer)
    @conversation = conversation
    @params = params
    @customer = customer
    @shared_service = SmsService::SharedService.new(conversation, params)
    set_shopify_session
  end

  def process
    if %w[SWAP SKIP QUANTITY BILLING SHIPPING PRODUCT CANCEL PAUSE RESUME].include?(@conversation.command)
      @data = @shared_service.customer_subscriptions(@customer.shopify_id)
      if @conversation.command != 'PAUSE' && @data[:active_subscriptions].count.zero?
        @shared_service.send_message('You have no active subscriptions.')
        return
      end
    end
    case @conversation.command
    when 'STOP'
      stop_conversation
    when 'SWAP'
      SmsService::SwapService.new(@conversation, @params, @data).process
    when 'SKIP'
      SmsService::SkipService.new(@conversation, @params, @data).process
    when 'QUANTITY'
      SmsService::QuantityService.new(@conversation, @params, @data).process
    when 'BILLING'
      SmsService::BillingService.new(@conversation, @params, @data, @customer).process
    when 'SHIPPING'
      SmsService::ShippingService.new(@conversation, @params, @data, @customer).process
    when 'PRODUCT'
      SmsService::ProductService.new(@conversation, @params, @data, @customer).process
    when 'CANCEL'
      SmsService::CancelService.new(@conversation, @params, @data, @customer).process
    when 'PAUSE'
      SmsService::PauseService.new(@conversation, @params, @data).process
    when 'RESUME'
      SmsService::ResumeService.new(@conversation, @params, @data).process
    when 'INFO'
      SmsService::InfoService.new(@conversation, @params).info_data
    when 'END'
      end_conversation
    else
      @shared_service.send_message('Invalid Command')
    end
  rescue Exception => ex
    { error: true, message: 'Invalid Request' }
  end

  def stop_conversation
    @conversation.update(command: 'STOP', status: :stoped)
  end

  def end_conversation
    @conversation.update(command: @params['Body'], status: :stoped)
  end

  def set_shopify_session
    session = ShopifyAPI::Session.new(domain: @customer.shop.shopify_domain, token: @customer.shop.shopify_token, api_version: "2021-01")
    ShopifyAPI::Base.activate_session(session)
  end
end
