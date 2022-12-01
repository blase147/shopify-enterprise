class FetchAllOrdersAndSubscriptionBulkWorker
    def perform_async
        ShpoifyBulkOperation.new.get_all_orders
        ShpoifyBulkOperation.new.get_all_subscriptions
    end
end