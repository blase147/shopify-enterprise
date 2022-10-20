class EmailService::Sendgrid < EmailService::Base
  require 'sendgrid-ruby'
  include SendGrid

  def initialize(email_notification)
    init_session(email_notification.setting.shop)
    @email_notification = email_notification
    shopify_shop
  end

  def shopify_shop
    @shopify_shop ||= @email_notification.setting.shop.with_shopify_session do
      ShopifyAPI::Shop.current
    end
  end

  def init_session(shop)
    integration = shop.email_integration_service
    # if integration.present?
    @sg = SendGrid::API.new(api_key: (integration.credentials['private_key'] rescue ENV['SENDGRID_API_KEY']))
    # end
  end

  def send_email(object)
    subject_str = subject(object)
    return unless subject_str
    context_hash = context(object)
    to = object[:customer]&.email
    to = shopify_shop.email if @email_notification.slug == 'store_owner'
    from = SendGrid::Email.new(email: 'notifications@chargezen.com', name: (@email_notification.from_name || @email_notification.setting.store_name || shopify_shop.name))
    to = SendGrid::Email.new(email: to)
    content = SendGrid::Content.new(type: 'text/html', value: email_body(context_hash))
    mail = SendGrid::Mail.new(from, (@email_notification.email_subject || subject_str), to, content)
    mail.reply_to = SendGrid::Email.new(email: @email_notification.from_email, name: (@email_notification.from_name || @email_notification.setting.store_name || shopify_shop.name))

    response = @sg.client.mail._('send').post(request_body: mail.to_json)
    # puts response.status_code
    # puts response.body
    # puts response.parsed_body
    respone_body = {}
    respone_body = { status: response.status_code.to_i > 200 && response.status_code.to_i < 300, email_body: email_body(context_hash)}
    return respone_body
  rescue => e
    puts e
    false
  end
end
