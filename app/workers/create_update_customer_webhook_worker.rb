class CreateUpdateCustomerWebhookWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_id ,params)        
        data = JSON.parse(params, object_class: OpenStruct)
        CreateCustomerModalService.create(shop_id, data)
    end
end