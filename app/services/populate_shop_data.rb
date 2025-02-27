class PopulateShopData
  def initialize(shop)
    @shop = shop
  end

  def populate_data
    @shop.smarty_messages.delete_all
    @shop.smarty_cancellation_reasons.delete_all
    @shop.smarty_variables.delete_all
    # Billing Update
    @shop.smarty_messages.create(title: 'Modify Order - Billing Info', body: "Your current preferred payment method is:\n{{card_brand - card_last4}}\nExpiration {{card_exp_month/card_exp_year}}\nTo update your payment info, please check the email we just sent to your email address on file.")

    # Delay Order
    @shop.smarty_messages.create(title: 'Delay Order - Invalid Option', body: "Oops, it seems you entered an incorrect answer, please choose a valid option:\n1. 1w (Delay 1 week)\n2. 2w (Delay 2 weeks)\n3. 3w (Delay 3 weeks)")

    @shop.smarty_messages.create(title: 'Delay Order - Failure', body: "We were unable to delay your upcoming order of {{subscription_title}} scheduled for
    {{subscription_charge_date}} . Please try again or contact support at {{@shop_email}}")

    @shop.smarty_messages.create(title: 'Delay Order - Options', body: "Please choose from the following options to delay your upcoming order:\n1. 1w (Delay 1 week)\n2. 2w (Delay 2 weeks)\n3. 3w (Delay 3 weeks)")

    @shop.smarty_messages.create(title: 'Delay Order - Success', body: "Awesome!, you've pushed back this order by {{delay_weeks}} week(s). It will process on
    {{subscription_charge_date}}")

    @shop.smarty_messages.create(title: 'Delay Order - Confirm', body: "Your next delivery date would be around the {{subscription_charge_date}}, Reply with 'yes' if you want to delay?")

    #Skip Order

    @shop.smarty_messages.create(title: 'Skip Order - Cancel', body: "Alright, we're still on schedule for your order planned for {{subscription_charge_date}}.")
    @shop.smarty_messages.create(title: 'Skip Order - Confirm', body: "Hey {{first_name}}! confirm you want to skip your order for {{subscription_title}} scheduled for {{subscription_charge_date}}? If so, please reply 'Y' to confirm or 'N' to ignore.")
    @shop.smarty_messages.create(title: 'Skip Order - Invalid Option', body: "Oops, it seems you entered an incorrect answer, please choose a valid option. Reply 'Y' to confirm or 'N' to ignore.")
    @shop.smarty_messages.create(title: 'Skip Order - Failure', body: "We were unable to skip your upcoming order scheduled for {{subscription_charge_date}}. Please try again later or contact support at {{@shop_email}}")
    @shop.smarty_messages.create(title: 'Skip Order - Success', body: "Awesome! You’ve skipped the order originally planned for {{old_charge_date}}, so your next order will now process on {{subscription_charge_date}}.")

    # Edit Quantity
    @shop.smarty_messages.create(title: 'Edit quantity - Cancel', body: "Alright, the quantity of your order for {{line_item_name}} remains {{line_item_qty}} pc(s)")
    @shop.smarty_messages.create(title: 'Edit quantity - Confirm', body: "Hey {{first_name}}! confirm you want to change the quantity of your order for {{line_item_name}}? If so, please reply 'Y' to confirm or 'N' to ignore.")
    @shop.smarty_messages.create(title: 'Edit quantity - Conditional', body: "Your order for {{subscription_title}} has the following line items:\n{{line_item_list}}\nPlease respond with the ID of the line item whose quantity you want to change.")
    @shop.smarty_messages.create(title: 'Edit quantity - conditional_response', body: "Got it! Please reply with the new quantity for {{line_item_name}}")
    @shop.smarty_messages.create(title: 'Edit quantity - conditional_response_failure', body: "Oops, it seems you entered an incorrect answer, please choose a valid option")
    @shop.smarty_messages.create(title: 'Edit quantity - Success', body: "Awesome! We’ve changed the quantity of {{line_item_name}}. It will be reflected in your next delivery.")
    @shop.smarty_messages.create(title: 'Edit quantity - failure', body: "Oops, we’re unable to change the quantity of your order. Please try again or contact support at {{@shop_email}}.")
    @shop.smarty_messages.create(title: 'Edit quantity- Invalid Option', body: "Oops, it seems you entered an incorrect answer, please choose a valid option. Reply 'Y' to confirm or 'N' to ignore.")

    # Cancelation
    @shop.smarty_messages.create(title: 'End Subscription - confirmation', body: "Confirm you want to cancel your subscription to order {{subscription_title}}? If so, please reply 'Y' to confirm or 'N' to ignore")
    @shop.smarty_messages.create(title: 'End Subscription - Cancel', body: "OK, ignored.If you need anything else, let us know. You can reply with 'HEY' or email us at {{@shop_email}}")
    @shop.smarty_messages.create(title: 'End Subscription - Cancellation Reason', body: "Ok {{first_name}} - before we end your subscription, which of the following best describes why you'd like to cancel? \n{{cancellation_reasons}}")
    @shop.smarty_messages.create(title: 'End Subscription - invalid option', body: "Oops, it seems you entered an incorrect answer, please choose a valid option. Reply 'Y' to confirm or 'N' to ignore")
    @shop.smarty_messages.create(title: 'End Subscription - Winback Swap', body: "Do you want to swap a product for your current subscription (SWAP) or continue with the cancellation of your subscription (CONTINUE) ?")
    @shop.smarty_messages.create(title: 'End Subscription - Winback Skip', body: "Do you want to skip a product for your current subscription (SKIP) or continue with the cancellation of your subscription (CONTINUE) ?")
    @shop.smarty_messages.create(title: 'End Subscription - Success', body: "Sad to see you go! Text 'Restart' to resubscribe at any time and we'd love you to share more detailed feedback at @shop_email. Cheers! <3 {{@shop_name}}")
    @shop.smarty_messages.create(title: 'End Subscription - Failure', body: "Hey {{first_name}}!, it looks like your subscription for {{subscription_title}} is already cancelled! For more information, go to: {{manage_subscriptions_url}} or contact us at {{@shop_email}}")
    @shop.smarty_messages.create(title: 'End Subscription - Contact', body: "Someone from our support team will be in touch with you soon & they'll assist you with your request.")

    #Opt In
    @shop.smarty_messages.create(title: 'Opt-in', body: "Hey {{first_name}}! Welcome to the {{@shop_name}} SMS service! You can manage your subscription via sms without having to log into the customer portal or contacting support.. Just reply 'HEY' to this number at any time.  To opt-out of this service, reply with 'STOP'")
    @shop.smarty_messages.create(title: 'Opt-in - success', body: "Hey {{first_name}}! We are preparing to ship your order of {{subscription_title}}. To manage your future orders via SMS, save this number and reply with 'HEY' at any time.")

    # Charge Faillure
    @shop.smarty_messages.create(title: 'Charge - Failure', body: "Hey {{first_name}}!, we are unable to charge your order, someone from our support team will be in touch with you soon.")

    @shop.smarty_messages.create(title: 'Charge - Reminder', body: "Hey {{first_name}}! We are preparing to ship your order of {{subscription_title}}. To manage your future orders via SMS, save this number and reply with 'HEY' at any time")
    @shop.smarty_messages.create(title: 'Login - OTP', body: "Hi {{first_name}},Your OTP to login Ethey Meals is {{otp}}.It is valid for 15 minutes only.")
    @shop.smarty_messages.create(title: 'Stripe Contract', body: "Hi {{first_name}}, Please check your electricity contracts at {{stripe_app_proxy_url}} .")
    @shop.smarty_messages.create(title: 'Rebuy', body: "Hi {{first_name}}, Please check the recommended products for you at {{stripe_app_proxy_url}} .")

    #meal_selection
    @shop.smarty_messages.create(title: 'Meal selction', body: "Hi {{first_name}}!, You have successfully selected meals for {{begin_date}} - {{end_date}} week.")

    #skip meals success
    @shop.smarty_messages.create(title: 'Skip Meal', body: "Hi {{first_name}}!, Meal is skipped from {{begin_date}} to {{end_date}}")

    #paused subscription success
    @shop.smarty_messages.create(title: 'Paused Subscription', body: "Hi {{first_name}}!, Your {{product_title}} subscription is paused successfully.")

    #cancelled subscription success
    @shop.smarty_messages.create(title: 'Cancelled Subscription', body: "Hi {{first_name}}!, Your {{product_title}} subscription is cancelled successfully.")

    #resumed subscription success
    @shop.smarty_messages.create(title: 'Resumed Subscription', body: "Hi {{first_name}}!, Your {{product_title}} subscription is resumed successfully.")

    #restarted subscription success
    @shop.smarty_messages.create(title: 'Restarted Subscription', body: "Hi {{first_name}}!, Your {{product_title}} subscription is restarted successfully.")

    #Choose Meals success
    @shop.smarty_messages.create(title: 'Choose Meals', body: "Hi {{first_name}}!, You have successfully selected meals for {{begin_date}} - {{end_date}} week.")

    #Swap subscription success
    @shop.smarty_messages.create(title: 'Restarted Subscription', body: "Hi {{first_name}}!, Your subscription is swapped to {{variant_title}} successsfully.")

    #Un-Skip Meal success
    @shop.smarty_messages.create(title: 'Restarted Subscription', body: "Hi {{first_name}}!, You have successfully unskipped {{product_title}} subscription from {{begin_date}} to {{end_date}}.")

    #Cancellation Reasons
    @shop.smarty_cancellation_reasons.create(name: 'I want a different product or variety', winback: :swap)
    @shop.smarty_cancellation_reasons.create(name: 'I already have more than I need', winback: :skip)
    @shop.smarty_cancellation_reasons.create(name: 'I need it sooner')
    @shop.smarty_cancellation_reasons.create(name: 'I no longer use this product')
    @shop.smarty_cancellation_reasons.create(name: 'This is too expensive')
    @shop.smarty_cancellation_reasons.create(name: 'Other reason')
    @shop.smarty_cancellation_reasons.create(name: 'This was created by accident')
    

    @shop.smarty_variables.create(name: 'product_title')
    @shop.smarty_variables.create(name: 'variant_title')
    @shop.smarty_variables.create(name: 'begin_date')
    @shop.smarty_variables.create(name: 'end_date')
    #Billing Update
    @shop.smarty_variables.create(name: 'card_brand - card_last4')
    @shop.smarty_variables.create(name: 'card_exp_month/card_exp_year')
    #Delay Order
    @shop.smarty_variables.create(name: 'subscription_title')
    @shop.smarty_variables.create(name: 'subscription_charge_date')
    @shop.smarty_variables.create(name: 'delay_weeks')
    @shop.smarty_variables.create(name: 'delay_weeks')
    @shop.smarty_variables.create(name: '@shop_email')
    # Skip
    @shop.smarty_variables.create(name: 'first_name')
    @shop.smarty_variables.create(name: 'old_charge_date')

    #Edit Quantity
    @shop.smarty_variables.create(name: 'line_item_qty')
    @shop.smarty_variables.create(name: 'line_item_list')
    @shop.smarty_variables.create(name: 'line_item_name')

    #Cancellation Reason
    @shop.smarty_variables.create(name: 'manage_subscriptions_url')
    @shop.smarty_variables.create(name: 'cancellation_reasons')
    @shop.smarty_variables.create(name: '@shop_name')

    #OTP
    @shop.smarty_variables.create(name: 'otp')
    @shop.smarty_variables.create(name: 'stripe_app_proxy_url')


    #integrations

    if ENV['APP_TYPE'] == 'public'
    #sales
      @shop.integrations.find_or_create_by(integration_type: :sales, name: 'Hubspot')
      @shop.integrations.find_or_create_by(integration_type: :sales, name: 'Zoho CRM')
      @shop.integrations.find_or_create_by(integration_type: :sales, name: 'Pipedrive')
      @shop.integrations.find_or_create_by(integration_type: :sales, name: 'Salesforce')
      #marketing
      @shop.integrations.find_or_create_by(integration_type: :marketing, service_type: :email, name: 'Klaviyo', keys: 'public_key,private_key')
      @shop.integrations.find_or_create_by(integration_type: :marketing, service_type: :email, name: 'SendGrid', keys: 'private_key')
      @shop.integrations.find_or_create_by(integration_type: :marketing, name: 'Active Campaign')
      @shop.integrations.find_or_create_by(integration_type: :marketing, name: 'Zapier')
      @shop.integrations.find_or_create_by(integration_type: :marketing, name: 'LeadDyno')
      @shop.integrations.find_or_create_by(integration_type: :marketing, name: 'Referral Candy')
      @shop.integrations.find_or_create_by(integration_type: :marketing, name: 'Refersion')
      @shop.integrations.find_or_create_by(integration_type: :marketing, name: 'Friendbuy')
      @shop.integrations.find_or_create_by(integration_type: :marketing, service_type: :email, name: 'Mailchimp')

      #reporting_and_analytics

      @shop.integrations.find_or_create_by(integration_type: :reporting_and_analytics, name: 'Baremetrics')
      @shop.integrations.find_or_create_by(integration_type: :reporting_and_analytics, name: 'Chart Mogul')
      @shop.integrations.find_or_create_by(integration_type: :reporting_and_analytics, name: 'Stitch')
      @shop.integrations.find_or_create_by(integration_type: :reporting_and_analytics, name: 'ProfitWell')
      @shop.integrations.find_or_create_by(integration_type: :reporting_and_analytics, name: 'Google Analytics')

      # collaboration
      @shop.integrations.find_or_create_by(integration_type: :collaboration, name: 'Shopify')
      @shop.integrations.find_or_create_by(integration_type: :collaboration, name: 'Slack')
      @shop.integrations.find_or_create_by(integration_type: :collaboration, name: 'Twilio', keys: 'twilio_account_sid,twilio_auth_token,twilio_phone_number')
      @shop.integrations.find_or_create_by(integration_type: :collaboration, name: 'PieSync')
      @shop.integrations.find_or_create_by(integration_type: :collaboration, name: 'Moxtra')
      @shop.integrations.find_or_create_by(integration_type: :collaboration, name: 'Shipstation')

      #accounting

      @shop.integrations.find_or_create_by(integration_type: :accounting, name: 'Xero')
      @shop.integrations.find_or_create_by(integration_type: :accounting, name: 'Revenue Manager')
      @shop.integrations.find_or_create_by(integration_type: :accounting, name: 'QuickBooks')
      @shop.integrations.find_or_create_by(integration_type: :accounting, name: 'Intacct')

      # customer_support_and_success

      @shop.integrations.find_or_create_by(integration_type: :customer_support_and_success, name: 'Freshdesk')
      @shop.integrations.find_or_create_by(integration_type: :customer_support_and_success, name: 'Netero')
      @shop.integrations.find_or_create_by(integration_type: :customer_support_and_success, name: 'Zendesk')
      @shop.integrations.find_or_create_by(integration_type: :customer_support_and_success, name: 'Intercom')
      @shop.integrations.find_or_create_by(integration_type: :customer_support_and_success, name: 'Groove')

      #contract_management

      @shop.integrations.find_or_create_by(integration_type: :contract_management, name: 'GetAccept')

      #tax_management

      @shop.integrations.find_or_create_by(integration_type: :tax_management, name: 'Avalar')
      @shop.integrations.find_or_create_by(integration_type: :tax_management, name: 'TaxJar')
      @shop.integrations.find_or_create_by(integration_type: :tax_management, name: 'Hubspot')
    else
      @shop.integrations.find_or_create_by(integration_type: :marketing, service_type: :email, name: 'Klaviyo', keys: 'public_key,private_key')
      @shop.integrations.find_or_create_by(integration_type: :marketing, service_type: :email, name: 'SendGrid', keys: 'private_key')
      @shop.integrations.find_or_create_by(integration_type: :collaboration, name: 'Twilio', keys: 'twilio_account_sid,twilio_auth_token,twilio_phone_number')
    end

    option = 'storeowner_and_customer'
    @shop.setting.update(shipment: option, frequency: option, upcoming_quantity: option, shiping_address: option, reactive_subscription: option, subscription_cancellation: option, navigation_delivery: option, swap_product: option, pause_subscription: option)
  end
end
