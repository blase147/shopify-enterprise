class SendEmailService 
    def send_recurring_order_email(order_number, contract_id)
        contract = CustomerSubscriptionContract.find_by(shopify_id: contract_id)
        email_notification = contract.shop.setting.email_notifications.find_by_name "Recurring Charge Confirmation"
        products = []
        contract&.api_data["origin_order"]["line_items"]["edges"]&.each do |product|
            products << product["node"]["product"]["title"] unless product["node"]["product"]["title"]&.downcase&.include? "meals"
        end
        EmailService::Send.new(email_notification).send_email({customer: contract, order_details: "Order Number: #{order_number} Meals: #{products.to_sentence}", delivery_date: contract.api_data["delivery_date"] }) unless email_notification.nil?
    end
end