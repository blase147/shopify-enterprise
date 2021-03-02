class ScriptTagsController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def subscriptions
    @shop = Shop.find_by(shopify_domain: params[:shop_domain])
  end
end
