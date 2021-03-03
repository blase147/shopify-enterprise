# frozen_string_literal: true

class HomeController < ApplicationController
  include ShopifyApp::EmbeddedApp
  include ShopifyApp::RequireKnownShop

  def index
    @shop_origin = current_shopify_domain
    
    session[:hmac] = params[:hmac]
    session[:shop] = params[:shop]
    session[:session] = params[:session]
  end
end
