# frozen_string_literal: true
class Shop < ActiveRecord::Base
  include ShopifyApp::ShopSessionStorage

  def api_version
    ShopifyApp.configuration.api_version
  end

  has_many :selling_plan_groups
  has_one :setting
  has_many :customers
  
  has_many :upsell_campaign_groups

  def api_version
    ShopifyApp.configuration.api_version
  end

  def connect
    ShopifyAPI::Base.clear_session
    session = ShopifyAPI::Session.new(
      domain: shopify_domain,
      token: shopify_token,
      api_version: api_version
    )
    ShopifyAPI::Base.activate_session(session)
  end
end
