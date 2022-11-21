class CreateContractWithPaymentMethodRemoteWorker
    include Sidekiq::Worker  
    def perform
        params=$creating_params
        if params.present?
            contract = SubscriptionContractDraftService.new(params).fetch_customer
        end
        $creating_params=nil
    end
end