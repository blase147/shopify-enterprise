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
      shop = Shop.find_by(shopify_domain: shop_domain)
      shop.with_shopify_session do
        if box_product_ids
          order = ShopifyAPI::Order.new(id: params[:id])
          order.tags = ShopifyAPI::Product.where(ids: box_product_ids, fields: 'id,title').map(&:title).join(', ')
          order.save
        end
      end
    rescue => e
      p e
    end

    head :no_content
  end

  # TODO: move into background job
  def subscription_contract_create
    shop = Shop.find_by(shopify_domain: shop_domain)
    ShopifyContractCreateWorker.perform_async(shop.id, params[:id])

    head :no_content
  end

  def subscription_contract_update
    shop = Shop.find_by(shopify_domain: shop_domain)
    ShopifyContractUpdateWorker.perform_async(shop.id, params[:id])

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
