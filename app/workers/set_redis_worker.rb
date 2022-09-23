class SetRedisWorker
    include Sidekiq::Worker
    def perform(shop_id)
        shop = Shop.find(shop_id) rescue nil
        shop&.connect
        redis_subscriptions = ReportService.new.all_subscriptions.to_json
        temp=[]
        redis_subscriptions = JSON.parse(redis_subscriptions)
        redis_subscriptions.each do |s|
          temp << s.to_h.deep_transform_keys { |key| key.underscore }
        end
        $redis.set("subscriptions", temp.to_json)  
    end
end