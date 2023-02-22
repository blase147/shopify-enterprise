class CreateRebuyForAllCustomersWorker
    include Sidekiq::Worker
    def perform(shop_id)
        RebuyService.new(shop_id).create_rebuy
    end
end