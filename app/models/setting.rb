class Setting < ApplicationRecord
  belongs_to :shop
  enum design_type: %i[one two]
  has_many :email_notifications, dependent: :destroy
  has_many :reasons_cancels, dependent: :destroy

  after_create :add_script_tags
  serialize :facing_frequency_option
  serialize :discount
  # serialize :checkout_subscription_terms
  accepts_nested_attributes_for :email_notifications,
  reject_if: :all_blank, allow_destroy: true

  accepts_nested_attributes_for :reasons_cancels,
  reject_if: :all_blank, allow_destroy: true

  after_save :set_design_metafield, if: -> { saved_change_to_design_type? }

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
    shop.add_metafield(ShopifyAPI::Metafield.new({ key: 'plan_selector_type', value: "design_type_#{design_type}", namespace: 'extension', value_type: 'string' }))
  end

  private ##

  def add_script_tags
    ScriptTagsService.new(shop).add
  end
end
