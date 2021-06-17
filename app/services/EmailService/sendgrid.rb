class EmailService::Sendgrid < EmailService::Base
  require 'sendgrid-ruby'
  include SendGrid

  def initialize(email_notification)
    init_session(email_notification.setting.shop)
    @email_notification = email_notification
    @shopify_shop = ShopifyAPI::Shop.current
  end

  def init_session(shop)
    integration = shop.email_integration_service
    if integration.present?
      @sg = SendGrid::API.new(api_key: integration.credentials['private_key'])
    end
  end

  def send_email(object)
    subject_str = subject(object)
    return unless subject_str
    context_hash = context(object)
    to = object[:customer]&.email
    to = @shopify_shop.email if @email_notification.slug == 'store_owner'
    from = SendGrid::Email.new(email: @email_notification.from_email)
    to = SendGrid::Email.new(email: to)
    content = SendGrid::Content.new(type: 'text/plain', value: email_body(context_hash))
    mail = SendGrid::Mail.new(from, subject_str, to, content)

    response = @sg.client.mail._('send').post(request_body: mail.to_json)
    # puts response.status_code
    # puts response.body
    # puts response.parsed_body
    response.status_code.to_i > 200 && response.status_code.to_i < 300
  end

end
