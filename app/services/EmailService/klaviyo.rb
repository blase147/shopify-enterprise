class EmailService::Klaviyo < ApplicationService
  require 'uri'
  require 'net/http'
  require 'openssl'

  def initialize(email_notification)
    @email_notification = email_notification
    @shopify_shop = ShopifyAPI::Shop.current
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

  def subject(object)
   case @email_notification.name
    when "Subscription Activation"
      "Your subscription order confirmation from #{@shopify_shop.name}"
    when "Subscription Cancellation"
      "You cancelled your subscription at #{@shopify_shop.name}"
    when "Recurring Charge Confirmation"
      "Your have successfully renewed your subscription at #{@shopify_shop.name}"
    when "Upcoming Charge"
      "Your upcoming shipment from #{@shopify_shop.name}"
    when "Card declined"
      "Your subscription order charge at #{@shopify_shop.name} failed"
    when "Skip Next Order"
      "Your modified your subscription at #{@shopify_shop.name}"
    when "Out of Stock"
      # "#{@shopify_shop.name} - Items on your subscription order are currently out of stock"
      false
    when "Cancellation Alert"
      "Customer #{object[:customer].name}} cancelled a subscription"
    else
      false
    end
  end

  def context(object)
    # card-update-link & out of stock are missing
    storename = @shopify_shop.name
    customer_portal_link = @shopify_shop.domain+"/account"
    shop_email = @shopify_shop.email
    myshopify_url = @shopify_shop.myshopify_domain
   case @email_notification.name
    when "Subscription Activation"
      {
        name: object[:customer].name,
        storename: storename,
        myshopify_url: myshopify_url,
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email
      }
    when "Subscription Cancellation"
      {
        name: object[:customer].name,
        storename: storename,
        subscription_line_item: object[:line_name],
        customer_portal_link: customer_portal_link
      }
    when "Recurring Charge Confirmation"
      {
        name: object[:customer].name,
        storename: storename,
        subscription_line_item: object[:line_name],
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email
      }
    when "Upcoming Charge"
      {
        name: object[:customer].name,
        storename: storename,
        myshopify_url: myshopify_url,
        subscription_line_item: object[:line_name],
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email
      }
    when "Card declined"
      # {
      #   name: object[:customer].name,
      #   storename: storename,
      #   myshopify_url: myshopify_url,
      #   subscription_line_item: object[:line_name],
      #   card_update_link: ,
      #   shopify_store_email: shop_email
      # }
      false
    when "Skip Next Order"
      {
        name: object[:customer].name,
        storename: storename,
        next_order_date: object[:next_order_date],
        shopify_store_email: shop_email
      }
    when "Out of Stock"
      # {
      #   storename: storename,
      #   customer_portal_link: customer_portal_link,
      #   subscription_line_item: ,
      #   customer_name: ,
      #   shopify_store_email: shop_email
      # }
      false
    when "Cancellation Alert"
      {
        storename: storename,
        customer_portal_link: customer_portal_link,
        subscription_line_item: object[:line_name],
        customer_name: object[:customer].name,
        shopify_store_email: shop_email
      }
    else
      false
    end
  end

  def send_email(object)
    subject_str = subject(object)
    return unless subject_str
    context_hash = context(object)
    to = object[:customer].email
    to = @shopify_shop.email if @email_notification.name == "Cancellation Alert"
    # binding.pry
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