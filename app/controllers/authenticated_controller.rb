# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::Authenticated

  helper_method :current_shop
  
  def current_shop
    @current_shop ||= Shop.find_by(shopify_domain: current_shopify_session.domain)
  end
end
