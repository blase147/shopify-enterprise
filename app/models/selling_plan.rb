class SellingPlan < ApplicationRecord
  belongs_to :selling_plan_group
  validates_presence_of :name, :selector_label
end
