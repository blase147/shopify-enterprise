class BuildABoxCampaign < ApplicationRecord
  belongs_to :build_a_box_campaign_group
  enum box_subscription_type: %i[undefined collection products]
end
