class SellingPlanGroup < ApplicationRecord
  attr_accessor :resources
  include SubscriptionPlan

  belongs_to :shop

  enum plan_type: %w(fixed_price free_trial build_a_box mystery_box)

  has_many :selling_plans, dependent: :destroy
  accepts_nested_attributes_for :selling_plans,
    reject_if: :all_blank, allow_destroy: true

  scope :with_shop, -> (sid) { where(shop_id: sid) }

  validates_presence_of :internal_name, :public_name, :plan_selector_title
end
