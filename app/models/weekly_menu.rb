# frozen_string_literal: true
# == Schema Information
#
# Table name: WeeklyMenus
#
#  id                      :bigint(8)        not null, primary key
#  box_subscription_type   :bigint(8)        
#  collection_images       :json
#  product_images          :json
#  triggers                :json
#  selling_plans           :json
#  selling_plan_ids        :string
#  display_name            :string
#  week                    :bigint(8)
#  cutoff_date             :date
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#

class WeeklyMenu < ApplicationRecord
  belongs_to :shop
  enum box_subscription_type: %i[undefined collection products]

  before_save :refresh_selling_plan_ids

  def refresh_selling_plan_ids
    self.selling_plan_ids = selling_plans.pluck('sellingPlanId').map{|sp_id| sp_id[/\d+/]}
  end
end
