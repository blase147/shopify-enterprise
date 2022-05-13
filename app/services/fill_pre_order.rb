class FillPreOrder
  def initialize(pre_order_ids, subscription_contract_id)
    @pre_order_ids = pre_order_ids
    @subscription_contract = CustomerSubscriptionContract.find subscription_contract_id
  end

  def fill
    WorldfarePreOrder.where(id: @pre_order_ids).each do |pre_order|
      pre_order_products = JSON.parse(pre_order.products)
      products_to_be_added = meals_on_plan - pre_order_products.count
      unless manual_update_required?
        if pre_order_products.count < meals_on_plan
          last_week_number = Date.today.cweek - 1
          last_week_order = WorldfarePreOrder.where(shopify_contract_id: @subscription_contract.shopify_id, week: last_week_number).last
          if last_week_order.present?
            last_week_products = JSON.parse(last_week_order.products)
            has_desired_products = last_week_products.count >= products_to_be_added
            if has_desired_products
              updated_products = pre_order_products << last_week_products.last(products_to_be_added)
              pre_order.products = updated_products.flatten
              pre_order.save
            else
              fill_from_first_order(pre_order, products_to_be_added)
            end
          else
            fill_from_first_order(pre_order, products_to_be_added)
          end
        else
          puts "WorldfarePreOrder ID: #{pre_order.id} has products #{pre_order_products.count} and meals on plan has #{meals_on_plan}"
        end
      else
        fill_from_first_order(pre_order, products_to_be_added)
      end
    end
  end

  def fill_from_first_order(pre_order, products_to_be_added)
    pre_order_products = JSON.parse(pre_order.products)
    required_products = []
    first_order_products.each do |item|
      next if item["node"]["product"]["title"].downcase.include?('meal box')
      next if item["node"]["product"]["title"].downcase.include?('meal')
      if required_products.count < products_to_be_added
        required_products << item["node"]["product"]["id"][/\d+/]
      end
    end

    if required_products.count < products_to_be_added
      puts "fetching from WeeklyMenu...."
      required_products << fill_from_weekly_menu(pre_order, required_products, products_to_be_added)
    else
      puts "No need to fetch from WeeklyMenu.. products filled"
    end

    updated_products = pre_order_products << required_products
    
    pre_order.products = updated_products.flatten
    pre_order.save
  end

  def fill_from_weekly_menu(pre_order, required_products, products_to_be_added)
    weekly_menu = WeeklyMenu.find_by(week: pre_order.week)
    menu_products = first.collection_images.last.to_h["products"]
    menu_products ||= weekly_menu.product_images
    
    menu_products.each do |product|
      if required_products.count > products_to_be_added
        required_products << product["product_id"][/\d+/]
      end
    end

    required_products
  end

  private

  def first_order_products
    @subscription_contract.api_data["origin_order"]["line_items"]["edges"]
  end

  def meals_on_plan
    @subscription_contract.subscription.split[0].to_i
  end

  def manual_update_required?
    first_order_meal_count = @subscription_contract.api_data["origin_order"]["line_items"]["edges"].count - 1
    meals_on_plan < first_order_meal_count
  end
end