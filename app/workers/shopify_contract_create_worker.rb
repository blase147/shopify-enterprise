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
      if contract.present? && order_id.present?
        order = ShopifyAPI::Order.find(order_id)
        note_hash = JSON.parse(order&.note) rescue {}
       if note_hash["delivery_date"].present?
        delivery_date = note_hash["delivery_date"].to_date.strftime("%d/%m/%Y")
       else
        calculate_delivery_date = calculate_delivery_date(shop_id)
        delivery_date = calculate_delivery_date.to_date.strftime("%d/%m/%Y")
       end
        delivery_day = delivery_date.to_date.strftime("%A")
        contract.api_data[:delivery_day] = delivery_day
        contract.api_data[:delivery_date] = delivery_date
        contract.save
      end
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
