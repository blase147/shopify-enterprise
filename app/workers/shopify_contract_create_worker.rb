class ShopifyContractCreateWorker
  include Sidekiq::Worker

  def perform(shop_id, id, order_id)
    unless CustomerSubscriptionContract.find_by(shopify_id: id)
      shop = Shop.find(shop_id)
      data = shop.with_shopify_session do
        SubscriptionContractService.new(id).run
      end
      selling_plan = SellingPlan.find_by(shopify_id: data&.lines&.edges.first&.node&.selling_plan_id)
      contract = CustomerSubscriptionContract.create(
        shopify_id: id,
        shop_id: shop.id,
        first_name: data.customer.first_name,
        last_name: data.customer.last_name,
        email: data.customer.email,
        phone: data.customer.phone,
        shopify_at: data.created_at.to_date,
        shopify_updated_at: data.updated_at&.to_date,
        status: data.status,
        subscription: data.lines.edges.first&.node&.title,
        language: "$#{data.lines.edges.first&.node&.current_price&.amount} / #{data.billing_policy.interval.pluralize}",
        communication: "#{data.billing_policy.interval_count} #{data.billing_policy.interval} Pack".titleize,
        shopify_customer_id: data.customer.id[/\d+/],
        api_source: 'shopify',
        api_data: data.to_h.deep_transform_keys { |key| key.underscore },
        selling_plan_id: selling_plan&.id
      )
      contract.save
      if contract.api_data.present?
        order_id = contract.api_data["origin_order"]["id"].split("/").last
        order = ShopifyAPI::Order.find(order_id)
        notes = order.note_attributes
        delivery_day = nil
        delivery_date = nil
        notes&.each do |note|
          if note&.name == "Delivery Date"
            delivery_date = note&.value
          elsif note&.name == "Delivery Day"
            delivery_day = note&.value
          end
        end
        
        order.tags << "#{ delivery_date, delivery_day) }"
        order.save

        note_hash = JSON.parse(order&.note) rescue {}
       unless delivery_date.present?
        calculate_delivery_date = calculate_delivery_date(shop_id)
        delivery_date = calculate_delivery_date.to_date
        delivery_day = delivery_date.strftime("%A")
        SendEmailService.new.send_missing_delivery_date_email(contract.id, delivery_date)
       end
        contract.delivery_day = delivery_day
        contract.delivery_date = delivery_date
        exclude = ["8 meals - medium", "6 meals - small", "4 meals - trial", "12 meals - large", "20 meals - family"]
        orders = []
        origin_orders = contract.api_data["origin_order"]["line_items"]["edges"]
        origin_orders&.each do |origin_order|
            unless exclude.include? origin_order["node"]["product"]["title"]&.downcase
                orders << origin_order
            end
        end
        contract.origin_order_meals = orders
        
        contract.save
      end
      SetRedisWorker.perform_async(contract.id)
      #Send Activation 2 hour email
      SendActivationTwoHourEmailWorker.perform_in(2.hours,contract.id, delivery_date)
      
      contract
    end
  end 

  def calculate_delivery_date(shop_id)
    current_day_number = Date.today.wday
    delivery_options = DeliveryOption.find_by_shop_id(shop_id)
    delivery_options = JSON.parse(delivery_options.settings)
    cutoff_days = []
    delivery_options&.each do |delivery_option|
      cutoff_days << Date.parse(delivery_option["cutoff_day"]).wday
    end

    diff = {}
    cutoff_days=cutoff_days.sort()

    nextdeliveryday=cutoff_days.reject { |c| c < current_day_number }
    cutoff_number=nextdeliveryday.length === 0 ? cutoff_days[0] : nextdeliveryday.first

    cuttoff_day = Date::DAYNAMES[cutoff_number&.to_i]
    delivery_option = delivery_options.select{|d| d["cutoff_day"]&.downcase == cuttoff_day&.downcase}

    delivery_day = delivery_option&.first["delivery"]
    delivery_date = Date.today.next_occurring(delivery_day&.downcase&.to_sym).to_date.strftime("%Y-%m-%d")
    return delivery_date
  end
end
