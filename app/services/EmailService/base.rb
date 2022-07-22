class EmailService::Base < ApplicationService

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
    when "Fill PreOrder"
      "#{@email_notification.email_subject} at #{@shopify_shop.name}"
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
    customer_portal_link = "https://"+@shopify_shop.domain+"/account"
    shop_email = @shopify_shop.email
    myshopify_url = "https://"+@shopify_shop.myshopify_domain
   case @email_notification.name
    when "Subscription Activation"
      {
        name: object[:customer].name,
        storename: storename,
        myshopify_url: myshopify_url,
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email,
        email_body: object[:email_body],
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
        order_details: object[:order_details],
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
    when 'Store Charge Confirmation'
      {
        storename: storename,
        shopify_store_email: shop_email,
        confirmation_url: object[:confirmation_url]
      }
    when "Fill PreOrder"
      {
        name: object[:customer].name
      }
    else
      false
    end
  end

  def email_body(context_hash)
    email_message = context_hash[:email_body]
    email_message ||= @email_notification.email_message
    context_hash.keys.each do |key|
      var = "{{"+key.to_s+"}}"
      email_message = email_message.gsub(var,context_hash[key].to_s)
    end
    email_message
  end

end
