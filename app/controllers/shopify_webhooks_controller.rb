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
      UpdateLoyalityPointsService.update_order_loyality_points(shop, params[:id])
    rescue => e
      p e
    end

    head :no_content
  end

  def order_cancelled
    preorder = WorldfarePreOrder.find_by(order_id: params[:id].to_s)
    preorder&.update(status: "canceled")
    shop = Shop.find_by(shopify_domain: shop_domain)
    ShopifyOrderCancelWorker.perform_async(shop.id, params[:id])
    UpdateLoyalityPointsService.update_order_loyality_points(shop, params[:id])
    head :no_content
  end

  def order_fulfilled
    preorder = WorldfarePreOrder.find_by(order_id: params[:id].to_s)
    preorder&.update(status: "fulfilled")
    SendEmailService.new.send_order_fulfiled_email(preorder&.shopify_contract_id)
    head :no_content
  end

  def order_updated
    if params[:financial_status] == "refunded"
      preorder = WorldfarePreOrder.find_by(order_id: params[:id])
      preorder&.update(status: "refunded")
      UpdateLoyalityPointsService.update_order_loyality_points(shop, params[:id])
    end
    head :no_content
  end

  def subscription_contract_create
    begin
      shop = Shop.find_by(shopify_domain: shop_domain)
      ShopifyContractCreateWorker.perform_async(shop.id, params[:id], params[:order_id])
    rescue => error
      puts "There is an error in subscription_contract_create:- #{error&.message}"
    end
    head :no_content
  end

  def subscription_contract_update
    shop = Shop.find_by(shopify_domain: shop_domain)
    ShopifyContractUpdateWorker.perform_async(shop.id, params[:id])

    head :no_content
  end


  def billing_attempt_success
    order_id = params[:order_id]
    contract_id = params[:subscription_contract_id]

    begin
      SendEmailService.new.send_recurring_order_email(order_id, contract_id)
      AddProductsToOrderWorker.perform_async(order_id, contract_id)
    rescue => error
      puts "There is an error in billing_attempt_success:- #{error&.message}"
    end

    head :no_content
  end

  def customer_create
    shop = Shop.find_by(shopify_domain: shop_domain)
    data = JSON.parse(params&.to_json, object_class: OpenStruct)
    CreateCustomerModalService.create(shop.id,data)
    head :no_content
  end

  def customer_update
    shop = Shop.find_by(shopify_domain: shop_domain)
    data = JSON.parse(params&.to_json, object_class: OpenStruct) rescue nil
    CreateCustomerModalService.create(shop.id,data)
    head :no_content
  end

  def customer_payment_method_create
    head :no_content
  end

  def customer_payment_method_update
    creating_params = JSON.parse(AddStripeCustomerMigration.find_by_customer_id(params[:customer_id])&.raw_data) rescue nil
    p creating_params.to_json
    creating_params = creating_params&.deep_symbolize_keys
    if  creating_params.present?
      data = creating_params
      data[:data][:payment_method_id] = params[:admin_graphql_api_id] if data.present? && params[:admin_graphql_api_id].present?
      CreateContractWithPaymentMethodRemoteWorker.perform_async(shop_domain,data.to_json) if data.present?
    end
    head :no_content
  end

  def customer_payment_method_revoke
    head :no_content
  end

  private
  Sidekiq.redis(&:flushdb)
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
