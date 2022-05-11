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

  task :fill_pre_order_and_add_items_to_shopify_order, [:shopify_order_id, :contract_id] do |t, args|
    puts "<============== Rake task started ==============>"
    shopify_order_id = args.shopify_order_id
    contract_id = args.contract_id

    contract = CustomerSubscriptionContract.find contract_id
    shop = contract.shop
    shop.connect
    meals_on_plan = contract.subscription.split[0].to_i
    
    order = ShopifyAPI::Order.find(shopify_order_id) rescue nil
    week_number = order.created_at.to_date.cweek rescue nil

    pre_order = WorldfarePreOrder.find_by(shopify_contract_id: contract.shopify_id, week: week_number)

    if pre_order.blank?
      pre_order = WorldfarePreOrder.create(shop_id: shop.id, shopify_contract_id: contract.shopify_id, week: week_number, customer_id: contract.shopify_customer_id, products: "[]", created_by: WorldfarePreOrder::CREATION_TYPES[:rake])
    end

    pre_order_products = JSON.parse(pre_order.products)

    if pre_order_products.count < meals_on_plan
      FillPreOrder.new(pre_order_ids, subscription_contract.id).fill
    end

    pre_order.reload
    pre_order_products = JSON.parse(pre_order.products)
    
    result = AddOrderLineItem.new(shopify_order_id, pre_order_products).call
    puts result.order_edit_commit.order
    puts result.order_edit_commit.user_errors
  end
end
