# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::Authenticated

  helper_method :current_shop

  def current_shop
    if params[:shopify_domain].present? && current_user.present?
      shop = current_user.user_shops.joins(:shop).where("shops.shopify_domain = '#{params[:shopify_domain]}.myshopify.com' OR shops.shopify_domain = '#{params[:shopify_domain]}'")&.first&.shop
      @current_shop = shop
    else
      @current_shop ||= Shop.find_by(shopify_domain: current_shopify_session.domain)
    end
  end
end
