# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::Authenticated

  helper_method :current_shop

  def current_shop
    if session[:shop_domain].present?
      @current_shop = Shop.find_by(shopify_domain: session[:shop_domain])
    else
      @current_shop ||= Shop.find_by(shopify_domain: current_shopify_session.domain)
    end
  end
end
