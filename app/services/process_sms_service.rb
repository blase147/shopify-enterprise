class ProcessSmsService
  def initialize(conversation, params, customer)
    @conversation = conversation
    @params = params
    @customer = customer
    @shared_service = SmsService::SharedService.new(conversation, params)
    @customer.shop.connect
  end

  def process
    return if !processing_allowed?(@customer) || !command_allowed?(@conversation)
    if %w[SWAP SKIP QUANTITY BILLING SHIPPING PRODUCT CLOSE RESTART PAUSE RESUME DELAY].include?(@conversation.command)
      @data = @shared_service.customer_subscriptions(@customer.shopify_id)
      if @conversation.command == 'PAUSE' && @data[:active_subscriptions].count.zero?
        @shared_service.send_message('You have no active subscription.')
        return
      elsif @conversation.command == 'RESTART' && @data[:cancelled_subscriptions].count.zero?
        @shared_service.send_message('You have no cancelled subscription.')
        return
      end
    end
    case @conversation.command
    when 'STOP'
      stop_conversation
    when 'SWAP'
      SmsService::SwapService.new(@conversation, @params, @data).process
    when 'DELAY'
      SmsService::DelayService.new(@conversation, @params, @data).process
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
    when 'CLOSE'
      SmsService::CancelService.new(@conversation, @params, @data, @customer).process
    when 'RESTART'
      SmsService::RestartService.new(@conversation, @params, @data).process
    when 'PAUSE'
      SmsService::PauseService.new(@conversation, @params, @data).process
    when 'RESUME'
      SmsService::ResumeService.new(@conversation, @params, @data).process
    when 'HEY'
      SmsService::InfoService.new(@conversation, @params).info_data
    when 'END'
      end_conversation
    else
      @shared_service.send_message('Invalid Command')
    end
  rescue Exception => ex
    p ex.message
    { error: true, message: 'Invalid Request' }
  end

  def process_keyword(response)
    @shared_service.send_message(response)
  end

  def stop_conversation
    @conversation.update(command: 'STOP', status: :stoped)
  end

  def end_conversation
    @conversation.update(command: @params['Body'], status: :stoped)
  end

  def processing_allowed?(customer)
    sms_setting = customer.shop.sms_setting
    return false if !sms_setting.present? || sms_setting&.disable?

    process = false
    if sms_setting.delivery_start_time.present? && sms_setting.delivery_end_time.present?
      start_time = formatted_datetime(sms_setting.delivery_start_time)
      end_time = formatted_datetime(sms_setting.delivery_end_time)
      process = (start_time..end_time).cover?(Time.current.in_time_zone('Pacific Time (US & Canada)'))
    end
    process
  end

  def command_allowed?(conversation)
    sms_setting = conversation.customer.shop.sms_setting
    return false unless sms_setting.present?

    process = true
    case conversation.command
    when 'SWAP'
      process = sms_setting.swap_product
    when 'DELAY'
      process = sms_setting.delay_order
    when 'SKIP'
      process = sms_setting.skip_update_next_charge
    when 'QUANTITY'
      process = sms_setting.edit_quantity
    when 'BILLING'
      process = sms_setting.update_billing
    when 'SHIPPING'
      process = sms_setting.order_tracking
    when 'PRODUCT'
      process = sms_setting.one_time_upsells
    when 'CLOSE'
      process = sms_setting.cancel_subscription
    when 'PAUSE'
      process = true
    when 'RESUME'
      process = sms_setting.cancel_reactivate_subscription
    end
    process
  end

  def formatted_datetime(time)
    DateTime.parse(Time.current.in_time_zone('Pacific Time (US & Canada)').strftime('%Y-%m-%d ') + time.strftime('%H:%M:00 ') + '-7:00')
  end
end
