class EmailService::Klaviyo < EmailService::Base
  require 'uri'
  require 'net/http'
  require 'openssl'
  require 'klaviyo'

  def initialize(email_notification)
    init_session(email_notification.setting.shop)
    @email_notification = email_notification
    @shopify_shop = ShopifyAPI::Shop.current
  end

  def init_session(shop)
    integration = shop.email_integration_service
    if integration.present?
      Klaviyo.public_api_key = integration.credentials['public_key']
      Klaviyo.private_api_key = integration.credentials['private_key']
    end
  end

  def fetch_template
    response = Klaviyo::EmailTemplates.get_templates()
    templates = JSON.parse(response.env.response_body)
    templates["data"].count
    tmp = rn["data"].select{|c| c if c["id"] == @email_notification.template_identity}
    tmp
  end

  def create_template
    response = Klaviyo::EmailTemplates.create_template(name: @email_notification.name, html: @email_notification.email_message)
    if response.env.status == 200
      parsed_json = JSON.parse(response.env.response_body)
      @email_notification.update_columns(template_identity: parsed_json["id"])
    end
  end

  def update_template
    url = URI("https://a.klaviyo.com/api/v1/email-template/#{@email_notification.template_identity}")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    request = Net::HTTP::Put.new(url)
    request["Accept"] = 'application/json'
    request["Content-Type"] = 'application/x-www-form-urlencoded'
    request.body = "api_key=#{ENV["KLAVIYO_PRIVATE_KEY"]}&name=#{@email_notification.name}&html=#{@email_notification.email_message}"
    response = http.request(request)
    parsed_json = JSON.parse(response.read_body)
    response.code.to_i == 200
  end

  def delete_template
    response = Klaviyo::EmailTemplates.delete_template(@email_notification.template_identity)
    response.env.status == 200
  end

  def send_email(object)
    subject_str = subject(object)
    return unless subject_str
    context_hash = context(object)
    to = object[:customer]&.email
    to = @shopify_shop.email if @email_notification.slug == 'store_owner'
    response = Klaviyo::EmailTemplates.send_template(
      @email_notification.template_identity,
      from_email: @email_notification.from_email,
      from_name: @email_notification.from_name,
      subject: subject_str,
      to: to,
      context: context_hash
    )
    # parsed_json = JSON.parse(response.env.response_body)
    response.env.status == 200
  end

end
