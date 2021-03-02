class UpsellCampaignGroup < ApplicationRecord
  enum status: %w(draft publish)

  has_many :upsell_campaigns, dependent: :destroy
  accepts_nested_attributes_for :upsell_campaigns,
    reject_if: :all_blank, allow_destroy: true

  validates_presence_of :internal_name, :public_name, :selector_title
end
