class ShopifyContractUpdateWorker
  include Sidekiq::Worker

  def perform(shop_id, id)
    shop = Shop.find(shop_id)
    data = shop.with_shopify_session do
      SubscriptionContractService.new(id).run
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
    unless contract.persisted?
      contract.shop_id = shop.id

      selling_plan = SellingPlan.find_by(shopify_id: data.lines.edges.first&.node&.selling_plan_id)
      contract.selling_plan_id = selling_plan&.id
    end
    contract.save
  end
end
