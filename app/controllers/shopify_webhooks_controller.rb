class ShopifyWebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token
  include ShopifyApp::WebhookVerification

  def app_uninstalled
    if ENV['APP_TYPE'] == 'public'
      shop = Shop.where(shopify_domain: params[:domain])
      if shop.present?
        shop.last.connect
        shop.last.destroy
      end
    end
    head :no_content
  end
end
