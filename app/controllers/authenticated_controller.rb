# frozen_string_literal: true

class AuthenticatedController < ApplicationController

  include ShopifyApp::Authenticated

  helper_method :current_shop

  def current_shop
    return @current_shop if @current_shop.present?

    shop = ShopifyAPI::Shop.current
    @current_shop = Shop.find_by(shopify_domain: shop.myshopify_domain)
  end
end
