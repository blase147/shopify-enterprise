class BuildABoxCampaign < ApplicationRecord
  belongs_to :build_a_box_campaign_group
  enum box_subscription_type: %i[undefined collection products]

  before_save :refresh_selling_plan_ids

  def refresh_selling_plan_ids
    self.selling_plan_ids = selling_plans.pluck('sellingPlanId').map{|sp_id| sp_id[/\d+/]}
  end
end
