class SendEmailService 
    def send_recurring_order_email(order_number, contract_id)
        contract = CustomerSubscriptionContract.find_by(shopify_id: contract_id)
        contract.shop.connect
        email_notification = contract.shop.setting.email_notifications.find_by_name "Recurring Charge Confirmation"
        order = ShopifyAPI::Order.find(order_number) rescue nil
        expected_order_delivery = CalculateOrderDelivery.new(contract, contract.shop.id).expected_delivery_of_order(order.created_at)
        products = []
        
        order&.line_items&.each do |product|
            products << product&.title unless product&.title&.downcase&.include? "meals"
        end

        EmailService::Send.new(email_notification).send_email({customer: contract, order_details: "Order Number: #{order_number} Meals: #{products.to_sentence}", delivery_date: expected_order_delivery.to_date.strftime("%A %B %d %Y") }) if email_notification.present? && contract.shop.setting.email_service.present?
    end

    def send_subscription_activation_email(contract_id)
        contract = CustomerSubscriptionContract.find(contract_id)
        if contract.present?
            email_notification = contract.shop.setting.email_notifications.find_by_name "Subscription Activation"
            products = []
            order_number = contract.api_data["origin_order"]["id"]&.split("/").last rescue nil
            if order_number.present?
                contract&.origin_order_meals&.each do |product|
                    products << product["node"]["product"]["title"] unless product["node"]["product"]["title"]&.downcase&.include? "meals"
                end
                EmailService::Send.new(email_notification).send_email({customer: contract, order_details_first: "Order Number: #{order_number} Meals: #{products.to_sentence}", delivery_date_first: contract.delivery_date }) if email_notification.present? && contract.shop.setting.email_service.present?
        
            end
        end
    end

    def send_missing_delivery_date_email(contract_id,delivery_date)
        contract = CustomerSubscriptionContract.find(contract_id)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Missing Delivery Date"
        products = []
        order_number = contract.api_data["origin_order"]["id"]&.split("/").last
        contract&.origin_order_meals&.each do |product|
            products << product["node"]["product"]["title"] unless product["node"]["product"]["title"]&.downcase&.include? "meals"
        end
        EmailService::Send.new(email_notification).send_email({customer: contract, order_details_first: "Order Number: #{order_number} Meals: #{products.to_sentence}", delivery_date_first: delivery_date }) if email_notification.present? && contract.shop.setting.email_service.present?
    end

    def send_subscription_activation_2_hours_email(contract_id, delivery_date)
        contract = CustomerSubscriptionContract.find(contract_id)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Subscription Activation 2 Hours"
        products = []
        order_number = contract.api_data["origin_order"]["id"]&.split("/").last
        if order_number.present?
            contract&.origin_order_meals&.each do |product|
                products << product["node"]["product"]["title"] unless product["node"]["product"]["title"]&.downcase&.include? "meals"
            end
            EmailService::Send.new(email_notification).send_email({customer: contract, order_details_first: "Order Number: #{order_number} Meals: #{products.to_sentence}", delivery_date_first: delivery_date }) if email_notification.present? && contract.shop.setting.email_service.present?
    
        end
    end

    def send_account_activation_url_email(contract, activation_url)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Account Activation URL"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract, activation_url: activation_url }) if email_notification.present? && contract.shop.setting.email_service.present?
        return sent
    end

    def send_order_fulfiled_email(contract_id)
        contract = CustomerSubscriptionContract.find_by_shopify_id(contract_id&.to_s)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Order fulfiled"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract }) if email_notification.present? && contract.shop.setting.email_service.present?
        return sent
    end

    def send_changes_reminder_email(contract_id)
        contract = CustomerSubscriptionContract.find_by_shopify_id(contract_id&.to_s)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Changes Reminder"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract}) if email_notification.present? && contract.shop.setting.email_service.present?
        return sent
    end

    def send_fill_preorder_email(contract_id, week_number)
        contract = CustomerSubscriptionContract.find_by_id contract_id
        contract ||= CustomerSubscriptionContract.find_by(shopify_id: contract_id)

        shop = contract.shop
        shop&.connect
        meals_on_plan = contract.subscription.split[0].to_i
        pre_order = WorldfarePreOrder.find_by(shopify_contract_id: contract.shopify_id, week: week_number)
        order = ShopifyAPI::Order.find(pre_order&.order_id) rescue nil
        expected_order_delivery = pre_order.expected_delivery_date
        delivery_day = expected_order_delivery&.to_date&.strftime("%A")

        products = []
        
        order&.line_items&.each do |product|
            products << product&.title unless product&.title&.downcase&.include? "meals"
        end

        email_notification = shop.setting.email_notifications.find_by_name "Fill PreOrder"
        customer_object = {customer: contract}
        sent= EmailService::Send.new(email_notification).send_email({customer: contract, day: delivery_day, delivery_date: expected_order_delivery, products:  products.to_sentence}) if email_notification.present? && contract.shop.setting.email_service.present?
        if sent
          SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "PreOrderEmailNotification sent")
        else
          SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_customer_id })
        end
        
        
        return sent
    end

    def send_otp_passwordless_login(contract, otp)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Passwordless Login OTP"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract,otp: otp}) if email_notification.present? && contract.shop.setting.email_service.present?
        if sent
            SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "Passwordless Login OTP sent")
        else
            SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_id })
        end
        return sent
    end

    def send_otp_user_shop_passwordless_login(user, otp)
        shop = Shop.find(user.shop_id)
        email_notification = shop.setting.email_notifications.find_by_name "Passwordless Login OTP"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: user,otp: otp}) if email_notification.present? && shop.setting.email_service.present?
        if sent
            SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "Passwordless Login OTP sent")
        else
            SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: user.id, shopify_id: user.shopify_id })
        end
        return sent
    end

    #-----------------------Contract Actions Emails----------------------
    def send_skip_meal(contract, begin_date, end_date)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Skip Meal"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract, begin_date: begin_date, end_date: end_date}) if email_notification.present? && contract.shop.setting.email_service.present?
        if sent
            SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "Skip Meal sent")
        else
            SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_customer_id })
        end
        return sent
    end

    def send_unskip_meal(contract, begin_date, end_date)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Un-Skip Meal"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract, begin_date: begin_date, end_date: end_date}) if email_notification.present? && contract.shop.setting.email_service.present?
        if sent
            SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "Un-Skip Meal sent")
        else
            SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_customer_id })
        end
        return sent
    end

    def send_status_subscription(contract, product_title, status)
        email_notification = contract.shop.setting.email_notifications.find_by_name "#{status&.humanize} Subscription"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract, product_title: product_title}) if email_notification.present? && contract.shop.setting.email_service.present?
        if sent
            SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: status)
        else
            SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_customer_id })
        end
        return sent
    end

    def send_swap_subscription(contract, variant_title)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Swap Subscription"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract, variant_title: variant_title}) if email_notification.present? && contract.shop.setting.email_service.present?
        if sent
            SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "Swap Subscription sent")
        else
            SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_customer_id })
        end
        return sent
    end

    def send_choose_meals(contract, begin_date, end_date)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Choose Meals"
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract, begin_date: begin_date, end_date: end_date}) if email_notification.present? && contract.shop.setting.email_service.present?
        if sent
            SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "Choose Meals sent")
        else
            SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_customer_id })
        end
        return sent
    end

    def send_set_password_email(object)
        @sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
        subject_str = object[:subject]
        context_hash = object[:email_body]
        to = object[:customer]&.email
        from = SendGrid::Email.new(email: 'notifications@chargezen.com', name: ("Chargezen"))
        to = SendGrid::Email.new(email: to)
        content = SendGrid::Content.new(type: 'text/html', value: context_hash)
        mail = SendGrid::Mail.new(from, (subject_str), to, content)
        mail.reply_to = SendGrid::Email.new(email: from.email, name: (from.name))    
        response = @sg.client.mail._('send').post(request_body: mail.to_json)
        respone_body = {}
        respone_body = { status: response.status_code.to_i > 200 && response.status_code.to_i < 300, email_body: context_hash}
        return respone_body
      rescue => e
        puts e
        false
    end
end
