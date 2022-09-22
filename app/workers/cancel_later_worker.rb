class CancelLaterWorker
    include Sidekiq::Worker
    def perform
        contracts = CustomerSubscriptionContract.all
        contracts&.each do |contract|
            if contract.cancel_later.present? && (contract.cancel_later&.strftime('%Y-%m-%d') === Date.current.strftime('%Y-%m-%d'))
                SubscriptionContractDeleteService.new(contract&.id).run
            end
        end
    end
end