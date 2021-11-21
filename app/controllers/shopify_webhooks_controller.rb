class ShopifyWebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token
  include ShopifyApp::WebhookVerification

  def app_uninstalled
    if ENV['APP_TYPE'] == 'public'
      shop = Shop.where(shopify_domain: params[:domain]).last
      if shop.present?
        shop.selling_plan_groups.each do |selling_plan_group|
          selling_plan_group.selling_plans.delete_all
          selling_plan_group.delete
        end
        shop.destroy
      end
    end
    head :no_content
  end

  def order_created
    begin
      box_product_ids = get_box_product_ids(params[:line_items])
      if box_product_ids
        order = ShopifyAPI::Order.new(id: params[:id])
        order.tags = ShopifyAPI::Product.where(ids: box_product_ids, fields: 'id,title').map(&:title).join(', ')
        order.save
      end
    rescue => e
      p e
    end

    head :no_content
  end

  # TODO: move into background job
  def subscription_contract_create
    shop = Shop.find_by(shopify_domain: params[:domain])
    data = SubscriptionContractService.new(params[:id]).run
    contract = CustomerSubscriptionContract.create(
      shop_id: shop.id,
      first_name: data.node.customer.first_name,
      last_name: data.node.customer.last_name,
      email: data.node.customer.email,
      phone: data.node.customer.phone,
      shopify_at: data.node.created_at.to_date,
      shopify_updated_at: data.node.updated_at&.to_date,
      status: data.node.status,
      subscription: data.node.lines.edges.first&.node&.title,
      language: "$#{data.node.lines.edges.first&.node&.current_price&.amount} / #{billing_policy.interval.pluralize}",
      communication: "#{billing_policy.interval_count} #{billing_policy.interval} Pack".titleize,
      shopify_customer_id: data.node.customer.id[/\d+/],
      api_source: 'shopify',
      api_data: data.to_h.deep_transform_keys { |key| key.underscore }
    )

    head :no_content
  end

  def subscription_contract_update
    data = SubscriptionContractService.new(params[:id]).run
    contract = CustomerSubscriptionContract.find_or_initialize_by(shopify_id: params[:id])

    contract.assign_attributes(
      first_name: data.node.customer.first_name,
      last_name: data.node.customer.last_name,
      email: data.node.customer.email,
      phone: data.node.customer.phone,
      shopify_at: data.node.created_at.to_date,
      shopify_updated_at: data.node.updated_at&.to_date,
      status: data.node.status,
      subscription: data.node.lines.edges.first&.node&.title,
      language: "$#{data.node.lines.edges.first&.node&.current_price&.amount} / #{billing_policy.interval.pluralize}",
      communication: "#{billing_policy.interval_count} #{billing_policy.interval} Pack".titleize,
      shopify_customer_id: data.node.customer.id[/\d+/],
      api_source: 'shopify',
      api_data: data.to_h.deep_transform_keys { |key| key.underscore }
    )
    unless contract.persisted?
      shop = Shop.find_by(shopify_domain: params[:domain])
      contract.shop_id = shop.id
    end
    contract.save

    head :no_content
  end

  private

  def get_box_product_ids(line_items)(line_items)
    line_items.each do |item|
      ids = item.properties.find{|p| p.name == "_box_product_ids"}
      return ids.value if ids
    end
    nil
  rescue
    nil
  end
end
