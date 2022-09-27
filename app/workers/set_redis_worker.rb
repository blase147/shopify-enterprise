class SetRedisWorker
    include Sidekiq::Worker
    def perform(shop_id, customer_id=nil)
        shop = Shop.find(shop_id) rescue nil
        shop&.connect
        redis_subscriptions = ReportService.new.all_subscriptions.to_json
        temp=[]
        redis_subscriptions = JSON.parse(redis_subscriptions)
        redis_subscriptions.each do |s|
          temp << s.to_h.deep_transform_keys { |key| key.underscore }
        end
        $redis.del("subscriptions")
        $redis.set("subscriptions", temp.to_json)  

        shopify_customer_id="gid://shopify/Customer/#{customer_id}" if customer_id.present?
        redis_customer_subscriptions = CustomerSubscriptionContractsService.new(shopify_customer_id).run&.to_json
        redis_customer_subscriptions = JSON.parse(redis_customer_subscriptions)
        redis_customer_subscriptions = redis_customer_subscriptions.deep_transform_keys { |key| key.underscore }
        updatedData={}
        redis_customer_subscriptions.map {|k,v| v.class == Array ? (updatedData[k]=[]; v.map {|a| updatedData[k] << a['data'] }) : updatedData[k]=v}
        redis_customer_subscriptions = updatedData&.to_json
        $redis.set("#{shopify_customer_id&.split("/").last}_customer_subscriptions", redis_customer_subscriptions)
    end
end