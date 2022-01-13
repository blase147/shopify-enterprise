# frozen_string_literal: true

class HomeController < ApplicationController
  include ShopifyApp::EmbeddedApp
  include ShopifyApp::RequireKnownShop

  def index
    unless session[:shop_id] # ensure cookie session as well
      session[:shop_id] = Shop.find_by(shopify_domain: current_shopify_domain).id
    end
    if ENV['APP_TYPE'] == 'public' && current_shop.recurring_charge_id.blank?
      redirect_to select_plan_index_path
    else
      @shop_origin = current_shopify_domain
      @enable_password = current_shop&.setting&.enable_password
    end
  end

  private

  def current_shop
    @current_shop ||= Shop.find_by(shopify_domain: current_shopify_domain)
  end
end
