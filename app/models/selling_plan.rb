class SellingPlan < ApplicationRecord
  belongs_to :selling_plan_group
  validates_presence_of :name, :selector_label
  enum box_subscription_type: %i[undefined collection products]
end
