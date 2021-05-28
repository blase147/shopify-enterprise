# frozen_string_literal: true
class Shop < ActiveRecord::Base
  include ShopifyApp::ShopSessionStorage

  def api_version
    ShopifyApp.configuration.api_version
  end

  has_many :selling_plan_groups, dependent: :destroy
  has_one :setting, dependent: :destroy
  has_many :customers, dependent: :destroy
  has_many :smarty_cancellation_reasons, dependent: :destroy
  has_many :custom_keywords, dependent: :destroy
  has_one :sms_setting, dependent: :destroy
  has_many :smarty_messages, dependent: :destroy
  has_many :smarty_variables, dependent: :destroy
  has_many :subscription_logs, dependent: :destroy

  has_many :upsell_campaign_groups, dependent: :destroy
  has_one :lock_password
  after_create :build_sms_setting
  after_create :setup_default_lock_password

  def setup_default_lock_password
    LockPassword.create(password: ENV['DEFAULT_LOCK_PASSWORD'], shop_id: id)
  end

  def build_sms_setting
    SmsSetting.find_or_create_by(shop_id: id)
  end

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

  def sync_contracts
    self.connect

    self.customers.each do |cus|
      cus.update_columns shopify_id: cus.shopify_id[/\d+/]
    end

    items = SubscriptionContractsService.new.all_subscriptions
    items[:subscriptions].each do |item|
      billing_policy = item.node.billing_policy

      customer = self.customers.find_or_create_by(shopify_id: item.node.id[/\d+/])
      customer.update_columns(
        first_name: item.node.customer.first_name,
        last_name: item.node.customer.last_name,
        email: item.node.customer.email,
        phone: item.node.customer.phone,
        shopify_at: item.node.created_at.to_date,
        shopify_updated_at: item.node.updated_at&.to_date,
        status: item.node.status,
        subscription: item.node.lines.edges.first&.node&.title,
        language: "$#{item.node.lines.edges.first&.node&.current_price&.amount} / #{billing_policy.interval.pluralize}",
        communication: "#{billing_policy.interval_count} #{billing_policy.interval} Pack".titleize
      )
    end
  end
end
