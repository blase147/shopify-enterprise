class CreateContractWithPaymentMethodRemoteWorker
    include Sidekiq::Worker  
    def perform(shop_domain,data)
        data = JSON.parse(data, object_class: OpenStruct) rescue nil
        if data.present?
            shop = Shop.find_by(shopify_domain: shop_domain)
            shop.connect
            contract = SubscriptionContractDraftService.new(data).fetch_customer
            p contract.to_json
            p contract.to_json
            $creating_params = nil
        end
    end
end