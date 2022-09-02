class ShopifyContractUpdateWorker
  include Sidekiq::Worker

  def perform(shop_id, id)
    shop = Shop.find(shop_id)
    shop.connect
    data = shop.with_shopify_session do
      SubscriptionContractService.new(id).update_contract
    end
    contract = CustomerSubscriptionContract.find_or_initialize_by(shopify_id: id)

    contract.assign_attributes(
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
      api_data: data.to_h.deep_transform_keys { |key| key.underscore }
    )

    if contract.api_data.present?
      order_id = contract.api_data["origin_order"]["id"].split("/").last
      order = ShopifyAPI::Order.find(order_id) rescue nil
      unless order.present?
        order_id = contract.api_data["orders"]["edges"].last["node"]["id"]&.split("/")&.last&.to_i
        order = ShopifyAPI::Order.find(order_id) rescue nil
      end
      notes = order.customAttributes
      delivery_day = nil
      delivery_date =nil
      notes&.each do |note|
        if note&.name == "Delivery Date"
          delivery_date = note&.value
        elsif note&.name == "Delivery Day"
          delivery_day = note&.value
        end
      end
      contract.delivery_date = delivery_date&.to_date
      contract.delivery_day = delivery_day
    end
    
    unless contract.persisted?
      contract.shop_id = shop.id

      selling_plan = SellingPlan.find_by(shopify_id: data.lines.edges.first&.node&.selling_plan_id)
      contract.selling_plan_id = selling_plan&.id
    end
    contract.save
  end
end
