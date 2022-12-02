class FetchAllOrdersAndSubscriptionBulkWorker
    include Sidekiq::Worker
    def perform
        Shop.all&.each do |shop|
            shop.connect rescue nil
            get_all_orders
            get_all_subscriptions
        end
    end

    def get_all_orders
        response = ShpoifyBulkOperation.new.get_all_orders rescue nil
        if response&.data&.bulk_operation_run_query&.user_errors&.first&.message&.include?("shop is already in progress")
            sleep 2
            get_all_orders
        end
    end

    def get_all_subscriptions
        response = ShpoifyBulkOperation.new.get_all_subscriptions rescue nil
        if response&.data&.bulk_operation_run_query&.user_errors&.first&.message&.include?("shop is already in progress")
            sleep 2
            get_all_subscriptions
        end
    end


end