class AppProxyController < ApplicationController
  include ShopifyApp::AppProxyVerification
  before_action :init_session
  before_action :set_skip_auth

  PER_PAGE = 6

  def current_shop
    @current_shop ||= Shop.find_by(shopify_domain: shop_domain)
  end

  def customer_id
    params[:customer_id]
  end

  def current_setting
    @setting ||= current_shop&.setting
  end

  def set_skip_auth
    @skip_auth ||= ShopSetting.find_by(shop_id: current_shop.id)&.shop_setting&.debug_mode
  end

  private ##

  def init_session
    current_shop.connect
    @setting ||= current_shop&.setting
    @translation ||= current_shop&.translation
  end

  def shopify_customer_id
    "gid://shopify/Customer/#{customer_id}"
  end
end
