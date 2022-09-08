class PauseLaterWorker
    include Sidekiq::Worker
    def perform
        contracts = CustomerSubscriptionContract.all
        contracts&.each do |contract|
            if contract.cancel_later.present? && (contract.pause_later&.strftime('%Y-%m-%d') === Date.current.strftime('%Y-%m-%d'))
                SubscriptionContractDeleteService.new(contract&.id).run 'PAUSED'
            end
        end
    end
end