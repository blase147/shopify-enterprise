# frozen_string_literal: true

class HomeController < ApplicationController
  include ShopifyApp::EmbeddedApp
  include ShopifyApp::RequireKnownShop

  def index
    @shop_origin = current_shopify_domain
    @enable_password = Shop.find_by(shopify_domain: current_shopify_domain)&.setting&.enable_password
  end
end
