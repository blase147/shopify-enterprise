class TwilioServices::SmsCallback < ApplicationService
  def initialize(params)
    @params = params
  end

  def call
    shop = Shop.where(phone: @params['To']).last
    # needs attention
    customer_modal = shop.customer_modal.where(phone: @params['From'])
    @customer = shop.customer_subscription_contracts.where.not(shopify_customer_id: nil).where(phone: @params['From']).last
    if customer_modal.present?
      process_callback
    else
      TwilioServices::SendSms.call(from: @params['To'], to: @params['From'], message: "Your phone number was not found in our database, please make sure you set the right phone number in your user profile at #{ENV['SHOP']}")
    end
  end

  def process_callback
    case @params['SmsStatus']
    when 'received'
      received
    else
      Rails.logger.info("TRACK: TWILIO SMS #{@params.to_json}")
    end
  end

  def received
    conversation = @customer.sms_conversations.find_or_create_by(status: :ongoing)
    sms_service = ProcessSmsService.new(conversation, @params, @customer)
    shared_service = SmsService::SharedService.new(conversation, @params)
    @params['Body'] = @params['Body'].strip
    upcase_body = @params['Body'].upcase
    keyword = @customer.shop.custom_keywords.active.where("ARRAY[keywords] @> ARRAY['#{@params['Body'].downcase}']")
    if keyword.present?
      sms_service.process_keyword(keyword.last.response)
      return
    elsif SmsConversation.commands.keys.include?(upcase_body.to_sym)
      conversation.sms_messages.create(from_number: @params['From'], to_number: conversation.customer.shop.phone, content: @params['Body'], comes_from_customer: true, command: upcase_body, command_step: 1)
      conversation.update(command: upcase_body, command_step: 1)
    elsif conversation.command.nil? && conversation.command_step.zero?
      shared_service.send_message('Invalid Command, Please try again.') and return
    else
      conversation.sms_messages.create(from_number: @params['From'], to_number: conversation.customer.shop.phone, content: @params['Body'], comes_from_customer: true, command: conversation.command, command_step: conversation.command_step + 1)
      conversation.update(command_step: conversation.command_step + 1)
    end
    response = sms_service.process
    shared_service.send_message(response[:message]) if response.is_a?(Hash) && response[:error].present?
  end
end
