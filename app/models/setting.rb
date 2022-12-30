class Setting < ApplicationRecord
  THEME_TYPE = {
    'Default': nil,
    'Worldfare': 'worldfare_'
  }.freeze

  belongs_to :shop
  enum design_type: %i[one two three]
  has_many :email_notifications, dependent: :destroy
  has_many :reasons_cancels, dependent: :destroy

  after_save :get_dates
  after_create :add_script_tags
  serialize :facing_frequency_option
  serialize :discount
  # serialize :checkout_subscription_terms
  accepts_nested_attributes_for :email_notifications,
  reject_if: :all_blank, allow_destroy: true

  accepts_nested_attributes_for :reasons_cancels,
  reject_if: :all_blank, allow_destroy: true

  after_save :set_design_metafield, if: -> { saved_change_to_design_type? || new_record? }
  after_save :update_account_portal_option_metafield, if: -> { saved_change_to_account_portal_option? || new_record? }

  def get_dates
    shop.connect
    ShopifyAPI::Metafield.create!(
      key: 'delivery_dates_data',
      value: {
        day_of_production: self.day_of_production,
        delivery_interval_after_production: self.delivery_interval_after_production,
        eligible_weekdays_for_delivery: self.eligible_weekdays_for_delivery
      }.to_json,
      namespace: 'chargezen',
      type: 'json'
    )
  end
  def style_content
    "#{style_account_profile} #{style_account_profile} #{style_subscription} #{style_upsell} #{style_sidebar_pages}"
  end

  def customer_allowed?(column)
    send(column) == 'storeowner_and_customer'
  end

  def admin_allowed?(column)
    send(column) == 'storeowner' || send(column) == 'storeowner_and_customer'
  end

  def set_design_metafield
    shop.connect
    shop = ShopifyAPI::Shop.current
    shop.add_metafield(ShopifyAPI::Metafield.new({ key: 'plan_selector_type', value: "design_type_#{design_type}", namespace: 'extension', type: 'multi_line_text_field' }))
  end

  def update_account_portal_option_metafield
    shop.connect
    ShopifyAPI::Metafield.create({ key: 'account_portal_option', value: account_portal_option, namespace: 'extension', type: 'multi_line_text_field' })
  end

  private ##

  def add_script_tags
    ScriptTagsService.new(shop).add
  end
end
