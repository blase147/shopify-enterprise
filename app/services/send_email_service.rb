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

        EmailService::Send.new(email_notification).send_email({customer: contract, order_details: "Order Number: #{order_number} Meals: #{products.to_sentence}", delivery_date: expected_order_delivery }) if email_notification.present? && contract.shop.setting.email_service.present?
    end

    def send_subscription_activation_email(contract_id)
        contract = CustomerSubscriptionContract.find(contract_id)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Subscription Activation"
        products = []
        order_number = contract.api_data["origin_order"]["id"]&.split("/").last
        contract&.origin_order_meals&.each do |product|
            products << product["node"]["product"]["title"] unless product["node"]["product"]["title"]&.downcase&.include? "meals"
        end
        EmailService::Send.new(email_notification).send_email({customer: contract, order_details_first: "Order Number: #{order_number} Meals: #{products.to_sentence}", delivery_date_first: contract.delivery_date }) if email_notification.present? && contract.shop.setting.email_service.present?
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
        contract&.origin_order_meals&.each do |product|
            products << product["node"]["product"]["title"] unless product["node"]["product"]["title"]&.downcase&.include? "meals"
        end
        EmailService::Send.new(email_notification).send_email({customer: contract, order_details_first: "Order Number: #{order_number} Meals: #{products.to_sentence}", delivery_date_first: delivery_date }) if email_notification.present? && contract.shop.setting.email_service.present?
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
     def send_fill_preorder_email(contract_id)
        contract = CustomerSubscriptionContract.find_by_id contract_id
        contract ||= CustomerSubscriptionContract.find_by(shopify_id: contract_id)

        week_number = Date.current.cweek
        shop = contract.shop
        meals_on_plan = contract.subscription.split[0].to_i

        pre_order = WorldfarePreOrder.find_by(shopify_contract_id: contract.shopify_id, week: week_number)

        pre_order_products = JSON.parse(pre_order.products) rescue []
       
        email_notification = shop.setting.email_notifications.find_by_name "Fill PreOrder"
        customer_object = {customer: contract}
        if EmailService::Send.new(email_notification).send_email(customer_object)
          SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "PreOrderEmailNotification sent")
        else
          SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_customer_id })
        end
        
        sent= EmailService::Send.new(email_notification).send_email({customer: contract}) if email_notification.present? && contract.shop.setting.email_service.present?
        return sent
    end
end
