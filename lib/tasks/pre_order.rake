namespace :pre_orders do
  task :fill_pre_order => :environment do
    puts "<============== Cron for PreOrder Started: at #{Time.current} ==============>"
    puts "<============== Processing for Week day number: #{Date.today.cweek} ==============>"
    CustomerSubscriptionContract.all.each do |subscription_contract|
      delivery_date = subscription_contract.api_data["delivery_date"]
      subscription_name = subscription_contract.subscription
      delivery_date ||= Date.today.next_week(:wednesday).yesterday.strftime("%m/%d/%Y")
      delivery_day = Date.strptime(delivery_date, '%m/%d/%Y').strftime("%A")

      todays_day = Date.today.strftime("%A")
      week_number = Date.today.cweek

      pre_order_ids = WorldfarePreOrder.where(shopify_contract_id: subscription_contract.shopify_id, week: week_number).pluck(:id)
      
      if delivery_day.eql?(todays_day) && pre_order_ids.present?
        puts "#{subscription_contract.id} is eligible to Pre-Fill order today"
        FillPreOrder.new(pre_order_ids, subscription_contract.id).fill
      else
        puts "#{subscription_contract.id} is not eligible to Pre-Fill order today"
      end
    end
    puts "<============== Cron for PreOrder Ended: at #{Time.current} ==============>"
  end

  task :fill_pre_order_contract, [:contract_id] do |t, args|
    puts "<============== Rake task started ==============>"
    CustomerSubscriptionContract.where(shopify_id: args.contract_id).each do |subscription_contract|
      shop = subscription_contract.shop
      shop.connect

      delivery_date = subscription_contract.api_data["delivery_date"]
      subscription_name = subscription_contract.subscription
      delivery_date ||= Date.today.next_week(:wednesday).yesterday.strftime("%m/%d/%Y")
      delivery_day = Date.strptime(delivery_date, '%m/%d/%Y').strftime("%A")

      todays_day = Date.today.strftime("%A")
      week_number = Date.today.cweek

      pre_order_ids = WorldfarePreOrder.where(shopify_contract_id: subscription_contract.shopify_id, week: week_number).pluck(:id)
      
      if delivery_day.eql?(todays_day) && pre_order_ids.present?
        puts "#{subscription_contract.id} is eligible to Pre-Fill order today"
        FillPreOrder.new(pre_order_ids, subscription_contract.id).fill
      else
        puts "#{subscription_contract.id} is not eligible to Pre-Fill order today"
      end
    end
  end
end
