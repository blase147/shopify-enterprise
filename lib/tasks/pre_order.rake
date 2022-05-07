namespace :pre_orders do
  task :fill_pre_order => :environment do
    puts "Cron for sync orders: at #{Time.current}"
    CustomerSubscriptionContract.each do |subscription_contract|
      delivery_date = subscription_contract.api_data["delivery_date"]
      subscription_name = subscription_contract.subscription
      delivery_date ||= Date.today.next_week(:wednesday).yesterday.strftime("%m/%d/%Y")
      delivery_day = Date.strptime(delivery_date, '%m/%d/%Y').strftime("%A")

      todays_day = Date.today.strftime("%A")
      week_number = Date.today.cweek

      pre_order_ids = WorldfarePreOrder.where(shopify_contract_id: subscription_contract.shopify_id, week: week_number).pluck(:id)
      
      if delivery_day.eql?(todays_day) && pre_order_ids.present?
        FillPreOrder.new(pre_order_ids, subscription_contract.id).fill
      end
    end
  end
end
