class ShopifyWebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token
  include ShopifyApp::WebhookVerification
  before_action :create_site_log, only: :billing_attempt_success

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

  def order_create
    begin
      box_product_ids = get_box_product_ids(params[:line_items])
      shop = Shop.find_by(shopify_domain: shop_domain)
      shop.with_shopify_session do
        if box_product_ids
          order = ShopifyAPI::Order.new(id: params[:id])
          order.tags = ShopifyAPI::Product.where(ids: box_product_ids, fields: 'id,title').map(&:title).join(', ')
          order.save
        end
        generate_and_send_account_activation_email
      end
    rescue => e
      p e
    end

    head :no_content
  end

  def subscription_contract_create
    shop = Shop.find_by(shopify_domain: shop_domain)
    ShopifyContractCreateWorker.perform_async(shop.id, params[:id], params[:order_id])

    head :no_content
  end

  def subscription_contract_update
    shop = Shop.find_by(shopify_domain: shop_domain)
    ShopifyContractUpdateWorker.perform_async(shop.id, params[:id])

    head :no_content
  end

  def order_cancel
    shop = Shop.find_by(shopify_domain: shop_domain)
    ShopifyOrderCancelWorker.perform_async(shop.id, params[:id])

    head :no_content
  end

  def billing_attempt_success
    order_id = params[:order_id]
    contract_id = params[:subscription_contract_id]
    AddProductsToOrderWorker.perform_async(order_id, contract_id)

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

  def create_site_log
    SiteLog.create(log_type: SiteLog::TYPES[:shopify_webhook], action: params[:action], controller: params[:controller], params: params)
  end

  def generate_and_send_account_activation_email
    order = ShopifyAPI::Order.find(params[:id])
    unless order.customer.state.eql?("enabled")
      AccountActivationEmailWorker.perform_async(order.customer.id)
    end
  rescue => e
    message = "#{e.message} from #{e.backtrace.first}"
    SiteLog.create(log_type: SiteLog::TYPES[:email_failure], message: message, params: params)
  end
end

=begin

webhooks.each do |webhook|
  if webhook.address.include?('ngrok')
    webhook.address.gsub!('https://98f6-72-255-40-54.ngrok.io/', ENV['HOST'])
    webhook.save
  end
end

=end
