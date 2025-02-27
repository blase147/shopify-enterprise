class EmailService::Base < ApplicationService

  def subject(object)
   case @email_notification.name
    when "Rebuy"
    "Send email with rebuy link"
    when "Stripe Contract"
      "Send email with app_proxy link"
    when "Set Admin Password"
      "Set your password"
    when "Skip Meal"
      "You skipped meal"
    when "Un-Skip Meal"
      "You un-skipped meal"
    when "Paused Subscription"
      "Your subscription is paused"
    when "Cancelled Subscription"
      "Your subscription is cancelled"
    when "Resumed Subscription"
      "Your subscription is resumed"
    when "Restarted Subscription"
      "Your subscription is restarted"
    when "Swap Subscription"
      "Your Subscription is swapped"
    when "Choose Meals"
      "You choosed some meals"

    when "Passwordless Login OTP"
      "OTP for Login"
    when "Changes Reminder"
      "Changes Reminder"
    when "Order fulfiled"
      "Hope you enjoy your order"
    when "Missing Delivery Date"
      "Confirm delivery date of order from #{@shopify_shop.name}"
    when "Subscription Activation 2 Hours"
      "Important details about your subscription from #{@shopify_shop.name}"
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
    when "Account Activation URL"
      "Activate your account for #{@shopify_shop.name}"
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
   when "Rebuy"
    {
      storename: storename,
      url: object[:url],
      customer_first_name: object[:customer].first_name&.humanize,
    }
   when "Stripe Contract"
    {
      storename: storename,
      url: object[:url],
      customer_first_name: object[:customer].first_name&.humanize,
    }
    when "Fill PreOrder"
      {
        storename: storename,
        myshopify_url: myshopify_url,
        customer_first_name: object[:customer].first_name&.humanize,
        day: object[:day],
        date: object[:delivery_date],
        products: object[:products]
      }
    when "Passwordless Login OTP"
      {
        storename: storename,
        myshopify_url: myshopify_url,
        customer_first_name: object[:customer].first_name&.humanize,
        otp: object[:otp]
      }
    when "Order fulfiled"
      {
        storename: storename,
        myshopify_url: myshopify_url,
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email
      }
    when "Changes Reminder"
      {
        storename: storename,
        myshopify_url: myshopify_url,
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email
      }
    when "Missing Delivery Date"
      {
        name: object[:customer].name,
        first_name: object[:customer].first_name&.humanize,
        order_details_first: object[:order_details_first],
        storename: storename,
        myshopify_url: myshopify_url,
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email,
        delivery_date_first: object[:delivery_date_first]
      }
    when "Subscription Activation 2 Hours"
      {
        name: object[:customer].name,
        first_name: object[:customer].first_name&.humanize,
        order_details_first: object[:order_details_first],
        storename: storename,
        myshopify_url: myshopify_url,
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email,
        delivery_date_first: object[:delivery_date_first]
      }
    when "Subscription Activation"
      {
        name: object[:customer].name,
        first_name: object[:customer].first_name&.humanize,
        order_details_first: object[:order_details_first],
        storename: storename,
        myshopify_url: myshopify_url,
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email,
        delivery_date_first: object[:delivery_date_first]
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
        first_name: object[:customer].first_name&.humanize,
        order_details: object[:order_details],
        storename: storename,
        subscription_line_item: object[:line_name],
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email,
        delivery_date: object[:delivery_date]
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
      #   card_update_link: "",
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
    when "Account Activation URL"
      {
        first_name: object[:customer].first_name&.humanize,
        activation_url: object[:activation_url],
        storename: storename,
        myshopify_url: myshopify_url,
        customer_portal_link: customer_portal_link,
        shopify_store_email: shop_email,
      }
    when "Skip Meal"
      {
        product_title: object[:customer]&.subscription&.humanize,
        customer_name: object[:customer].name&.humanize,
        begin_date: object[:begin_date],
        end_date: object[:end_date]
      }
    when "Un-Skip Meal"
      {
        product_title: object[:customer]&.subscription&.humanize,
        customer_name: object[:customer].name&.humanize,
        begin_date: object[:begin_date],
        end_date: object[:end_date]
      }
    when "Paused Subscription"
      {
        customer_name: object[:customer].name&.humanize,
        product_title: object[:product_title]
      }
    when "Cancelled Subscription"
      {
        customer_name: object[:customer].name&.humanize,
        product_title: object[:product_title]
      }
    when "Resumed Subscription"
      {
        customer_name: object[:customer].name&.humanize,
        product_title: object[:product_title]
      }
    when "Restarted Subscription"
      {
        customer_name: object[:customer].name&.humanize,
        product_title: object[:product_title]
      }
    when "Swap Subscription"
      {
        customer_name: object[:customer].name&.humanize,
        variant_title: object[:variant_title]
      }
    when "Choose Meals"
      {
        customer_name: object[:customer].name&.humanize,
        begin_date: object[:begin_date],
        end_date: object[:end_date]
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
