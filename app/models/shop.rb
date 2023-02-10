
# frozen_string_literal: true
class Shop < ActiveRecord::Base
  include ShopifyApp::ShopSessionStorage

  def api_version
    ShopifyApp.configuration.api_version
  end
  has_many :rebuys, dependent: :destroy
  has_many :stripe_contracts, dependent: :destroy
  has_one :referral, dependent: :destroy
  has_many :user_shop, dependent: :destroy
  has_many :analytics_data, dependent: :destroy
  has_many :usage_charges, dependent: :destroy
  has_many :pending_recurring_charges, dependent: :destroy
  has_many :bulk_operation_responses, dependent: :destroy
  has_many :csv_imports, dependent: :destroy
  has_many :selling_plan_groups, dependent: :destroy
  has_many :ways_to_earn_points, dependent: :destroy
  has_one :setting, dependent: :destroy
  has_many :customer_subscription_contracts, dependent: :destroy
  has_many :zip_codes, dependent: :destroy
  has_many :smarty_cancellation_reasons, dependent: :destroy
  has_many :custom_keywords, dependent: :destroy
  has_one :sms_setting, dependent: :destroy
  has_many :smarty_messages, dependent: :destroy
  has_many :smarty_variables, dependent: :destroy
  has_many :sms_flows, dependent: :destroy
  has_many :build_a_box_campaign_groups, dependent: :destroy
  has_many :bundle_groups, dependent: :destroy
  # has_many :sms_logs, dependent: :destroy
  has_many :subscription_logs, dependent: :destroy
  has_many :weekly_menus, dependent: :destroy

  has_many :upsell_campaign_groups, dependent: :destroy
  has_many :integrations, dependent: :destroy
  has_many :ship_engine_orders, dependent: :destroy
  has_many :customer_modals
  has_one :lock_password
  has_one :translation, dependent: :destroy
  after_create :build_setting
  after_create :setup_default_lock_password
  after_create :populate_store_data
  after_create :set_recurring_charge_id
  after_save :email_confirmation_link, if: -> { saved_change_to_charge_confirmation_link? }

  def setup_default_lock_password
    LockPassword.create(password: ENV['DEFAULT_LOCK_PASSWORD'], shop_id: id)
  end

  def build_setting
    setting = Setting.find_or_initialize_by(shop_id:  id)
    unless setting.persisted?
      setting.update(
        payment_retries: 3,
        payment_delay_retries: 1,
        cancel_enabled: true,
        pause_resume: true,
        attempt_billing: false,
        skip_payment: true,
        show_after_checkout: false,
        email_after_checkout: true,
        max_fail_strategy: 'skip',
        account_portal_option: 'add_link',
        active_subscription_btn_seq: ['update_choices', 'delivery_schedule', 'swap_subscription', 'delay_next_order', 'edit_subscription']
      )
    end
    SmsSetting.find_or_create_by(shop_id: id)
    Translation.find_or_create_by(shop_id: id)
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

    items = SubscriptionContractsService.new.all_subscriptions
    items[:subscriptions].each do |item|
      billing_policy = item.node.billing_policy

      customer = self.customer_subscription_contracts.find_or_create_by(shopify_id: item.node.id[/\d+/])
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
        communication: "#{billing_policy.interval_count} #{billing_policy.interval} Pack".titleize,
        shopify_customer_id: item.node.customer.id[/\d+/]
      )
    end
  end

  def populate_store_data
    PopulateShopData.new(self).populate_data
  end

  def email_integration_service
    name = setting.email_service
    if name.present? && integrations.marketing.email.where(name: name).exists?
      integrations.marketing.email.where(name: name).last
    else
      integrations.marketing.email.where(default: true).last
    end
  end

  def set_recurring_charge_id
    StoreChargeService.new(self).create_recurring_charge("freemium") if ENV['APP_TYPE'] == 'public'
  end

  def email_confirmation_link
    email_notification = setting.email_notifications.find_by_name('Store Charge Confirmation')
    EmailService::Send.new(email_notification).send_email({ confirmation_url: charge_confirmation_link }) if email_notification.present? && ENV['APP_TYPE'] == 'public'
  end
end
