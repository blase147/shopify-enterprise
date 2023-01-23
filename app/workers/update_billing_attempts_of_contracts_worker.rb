class UpdateBillingAttemptsOfContractsWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform
        CustomerSubscriptionContract.all&.each do |contract|
            shop = contract.shop
            shop.connect
            result = FetchBillingAttempts.new(contract.shopify_id).run rescue nil
            contract.billing_attempts = result.to_h.deep_transform_keys { |key| key.underscore } rescue {}
            contract.save
        end
    end
end