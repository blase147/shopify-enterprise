class CreateContractWithPaymentMethodRemoteWorker
    include Sidekiq::Worker  
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_domain,data)
        data = JSON.parse(data) rescue nil
        if data.present?
            shop = Shop.find_by(shopify_domain: shop_domain)
            shop.connect
            data = data.deep_stringify_keys
            contract = SubscriptionContractDraftService.new(data).fetch_customer
            p contract.to_json
            p contract.to_json
            AddStripeCustomerMigration.where(customer_id: data["customer_id"][/\d+/]&.to_i)&.destroy_all rescue nil
        end
    end
end

#trigger rebuild
