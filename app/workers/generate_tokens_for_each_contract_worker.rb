class GenerateTokensForEachContractWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform
        CustomerSubscriptionContract.where(token: nil)&.each do |customer|
            token = SecureRandom.urlsafe_base64(nil, false)
            customer.update(token: token)
        end
    end
end