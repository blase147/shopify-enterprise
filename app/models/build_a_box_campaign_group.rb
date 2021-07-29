class BuildABoxCampaignGroup < ApplicationRecord
  belongs_to :shop
  has_one :build_a_box_campaign
  accepts_nested_attributes_for :build_a_box_campaign,
    reject_if: :all_blank, allow_destroy: true
end
