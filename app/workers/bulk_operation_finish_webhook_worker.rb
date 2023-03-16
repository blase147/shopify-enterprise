class BulkOperationFinishWebhookWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_id, admin_graphql_api_id)   
        shop = Shop.find(shop_id)   
        shop.connect  
        ShpoifyBulkOperation.new.parse_bulk_operation(shop_id, admin_graphql_api_id)
    end
end