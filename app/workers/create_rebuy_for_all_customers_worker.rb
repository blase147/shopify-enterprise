class CreateRebuyForAllCustomersWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_id)
        RebuyService.new(shop_id).create_rebuy
    end
end