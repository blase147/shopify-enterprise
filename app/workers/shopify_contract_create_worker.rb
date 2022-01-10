class ShopifyContractCreateWorker
  include Sidekiq::Worker

  def perform(shop_id, id)
    # find subscription from db, if not found
    #   get the subscription detail from shopify
    #
    #
    # ShopifyAPI::Webhook
    # return
    unless CustomerSubscriptionContract.find_by(shopify_id: id)
      shop = Shop.find(shop_id)
      data = shop.with_shopify_session do
        SubscriptionContractService.new(id).run
      end
      p data

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
    end
  end
end
