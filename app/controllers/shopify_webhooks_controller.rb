class ShopifyWebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token
  include ShopifyApp::WebhookVerification
  before_action :create_site_log, only: :billing_attempt_success

  def app_uninstalled
    if ENV['APP_TYPE'] == 'public'
      if shop.present?
        shop.selling_plan_groups.each do |selling_plan_group|
          selling_plan_group.selling_plans.delete_all
          selling_plan_group.delete
        end
        shop.pending_recurring_charges.destroy_all
        shop.destroy
      end
    end
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def order_create
    begin
      box_product_ids = get_box_product_ids(params[:line_items])
      shop.with_shopify_session do
        if box_product_ids
          order = ShopifyAPI::Order.new(id: params[:id])
          order.tags = ShopifyAPI::Product.where(ids: box_product_ids, fields: 'id,title').map(&:title).join(', ')
          order.save
        end
        generate_and_send_account_activation_email
      end

      #check membership
      CustomerService.new({shop: shop}).check_order_for_associated_membership params[:id]

      UpdateLoyalityPointsService.update_order_loyality_points(shop, params[:id])
      if shop.shopify_domain.include?("curvos")
        CurvosBundleService.new.update_shopify_id(shop.id,params[:id])
      end
      RebuyService.new(shop.id).update_customer_order(params[:id])
    rescue => e
      NewRelic::Agent.notice_error(e)
    end

    head :no_content
  end

  def order_cancelled
    preorder = WorldfarePreOrder.find_by(order_id: params[:id].to_s)
    preorder&.update(status: "canceled")
    ShopifyOrderCancelWorker.perform_async(shop.id, params[:id])
    UpdateLoyalityPointsService.update_order_loyality_points(shop, params[:id])
    RebuyService.new(shop.id).update_customer_order(params[:id])
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def order_fulfilled
    preorder = WorldfarePreOrder.find_by(order_id: params[:id].to_s)
    preorder&.update(status: "fulfilled")
    RebuyService.new(shop.id).update_customer_order(params[:id])
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def order_updated
    if params[:financial_status] == "refunded"
      preorder = WorldfarePreOrder.find_by(order_id: params[:id])
      preorder&.update(status: "refunded")
      UpdateLoyalityPointsService.update_order_loyality_points(shop, params[:id])
    else
      if shop.shopify_domain.include?("curvos")
        CurvosBundleService.new.update_shopify_id(shop.id,params[:id])
      end
    end
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def subscription_contract_create
    begin
      ShopifyContractCreateWorker.perform_async(shop.id, params[:id], params[:order_id])
    rescue => error
      create_site_log
      NewRelic::Agent.notice_error(error)
    end
    head :no_content
  end

  def subscription_contract_update
    ShopifyContractUpdateWorker.perform_async(shop.id, params[:id])

    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end


  def billing_attempt_success
    order_id = params[:order_id]
    contract_id = params[:subscription_contract_id]

    begin
      SendEmailService.new.send_recurring_order_email(order_id, contract_id)
      AddProductsToOrderWorker.perform_async(order_id, contract_id)
    rescue => error
      NewRelic::Agent.notice_error(error)
    end
    head :no_content
  end

  def customer_create
    CreateUpdateCustomerWebhookWorker.perform_async(shop.id, params&.to_json)
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def customer_update
    CreateUpdateCustomerWebhookWorker.perform_async(shop.id, params&.to_json)
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def customer_payment_method_create
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def customer_payment_method_update
    creating_params = JSON.parse(AddStripeCustomerMigration.find_by_customer_id(params[:customer_id])&.raw_data) rescue nil
    creating_params = creating_params&.deep_symbolize_keys
    if  creating_params.present?
      data = creating_params
      data[:data][:payment_method_id] = params[:admin_graphql_api_id] if data.present? && params[:admin_graphql_api_id].present?
      CreateContractWithPaymentMethodRemoteWorker.perform_async(shop_domain,data.to_json) if data.present?
    end
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def customer_payment_method_revoke
    head :no_content
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  def bulk_operation_finish
    shop.connect
    BulkOperationFinishWebhookWorker.perform_async(shop.id, params[:admin_graphql_api_id]) if params[:status]=="completed"
  rescue Exception => ex
    NewRelic::Agent.notice_error(ex)
    head :no_content
  end

  private
  def get_box_product_ids(line_items)(line_items)
    line_items.each do |item|
      ids = item.properties.find{|p| p.name == "_box_product_ids"}
      return ids.value if ids
    end
    nil
  rescue => e
    NewRelic::Agent.notice_error(e)
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
    NewRelic::Agent.notice_error(e)
  end

  def shop
    shop = Shop.find_by(shopify_domain: shop_domain) rescue nil
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
