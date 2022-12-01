class FetchAllOrdersAndSubscriptionBulkWorker
    include Sidekiq::Worker
    def perform
        Shop.all&.each do |shop|
            shop.connect rescue nil
            ShpoifyBulkOperation.new.get_all_orders rescue nil
            ShpoifyBulkOperation.new.get_all_subscriptions rescue nil
        end
    end
end