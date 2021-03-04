class AppProxyController < ApplicationController
  include ShopifyApp::AppProxyVerification
  before_action :init_session

  PER_PAGE = 6

  def current_shop
    return @current_shop if @current_shop.present?
    @current_shop = Shop.find_by(shopify_domain: params[:shop])
  end

  def customer_id
    params[:customer_id]
  end

  private ##

  def init_session
    current_shop.connect
  end

  def shopify_customer_id
    "gid://shopify/Customer/#{customer_id}"
  end
end