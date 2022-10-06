class SetRedisWorker
  include Sidekiq::Worker
  def perform(contrarct_id)
    contract = CustomerSubscriptionContract.find(contrarct_id)
    contract&.shop&.connect
    redis_subscriptions=[]
    if $redis.get("subscriptions").present?
      redis_subscriptions = JSON.parse($redis.get("subscriptions"))
      current_sub = JSON.parse(ReportService.new.get_single_subscriptions(contract.shopify_id).to_json) rescue nil
      if current_sub.present? && contract.present?
        id="gid://shopify/SubscriptionContract/#{contract.shopify_id}"
        redis_subscriptions = redis_subscriptions.map{|r| a="#{r["data"]["node"]["id"]}" rescue nil; r unless a==id}
        data = {"data"=> {"node"=> current_sub["data"]}}
        redis_subscriptions = redis_subscriptions << data
      end
    else
      redis_subscriptions = []
      temp = JSON.parse(ReportService.new.all_subscriptions.to_json)
      temp.each do |s|
        redis_subscriptions << s.to_h.deep_transform_keys { |key| key.underscore }
      end  
    end
    $redis.del("subscriptions")
    $redis.set("subscriptions", redis_subscriptions.to_json)
  end
end