class AppProxyController < ApplicationController
  include ShopifyApp::AppProxyVerification
  before_action :init_session
  before_action :set_skip_auth

  PER_PAGE = 10

  def current_shop
    return @current_shop if @current_shop.present?

    @current_shop = Shop.find_by(shopify_domain: params[:shop])
    @current_shop&.connect
    return @current_shop
  end

  def customer_id
    params[:customer]
  end

  def current_setting
    @setting ||= current_shop&.setting
  end

  def set_skip_auth
    shop_setting = ShopSetting.find_by(shop_id: current_shop.id)
    @skip_auth = shop_setting.nil? || shop_setting.debug_mode.nil? ? false : shop_setting.debug_mode
  end

  private ##

  def init_session
    current_shop.connect
    @setting = current_shop&.setting
    @translation = current_shop&.translation
  end

  def shopify_customer_id
    "gid://shopify/Customer/#{customer_id}"
  end
end
