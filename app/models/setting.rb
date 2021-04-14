class Setting < ApplicationRecord
  belongs_to :shop
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

  def style_content
    "#{style_account_profile} #{style_account_profile} #{style_subscription} #{style_upsell} #{style_sidebar_pages}"
  end

  private ##

  def add_script_tags
    ScriptTagsService.new(shop).add
  end
end
