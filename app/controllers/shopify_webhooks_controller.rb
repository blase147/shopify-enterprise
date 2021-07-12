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
end
