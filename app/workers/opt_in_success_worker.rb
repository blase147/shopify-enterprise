class OptInSuccessWorker
    include Sidekiq::Worker
    def perform(contract_local_id)
        customer = CustomerSubscriptionContract.find(contract_local_id)
        shop = customer.shop
        shop.connect
        if customer.shopify_id.present?
            subscription = SubscriptionContractService.new(customer.shopify_id).run
            unless subscription.is_a?(Hash)
                conversation = customer.sms_conversations.order(created_at: :asc).first
                if conversation.present? && conversation.sms_messages.present? && conversation.sms_messages.order(created_at: :asc).first.command != 'STOP'
                    customer_modal = CustomerModal.find_by_shopify_id(customer&.shopify_customer_id)
                    message_service = SmsService::MessageGenerateService.new(customer.shop, customer, subscription)
                    message = message_service.content('Opt-in - success')
                    p message
                    TwilioServices::SendSms.call(from: shop.phone, to: customer_modal.phone, message: message) if shop.phone.present? && customer_modal&.phone.present?
                end
            end
        end
    end
end