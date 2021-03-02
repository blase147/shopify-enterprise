module Types
  class UpsellCampaignGroupType < Types::BaseObject
    field :id, ID, null: false
    field :internal_name, String, null: true
    field :selector_title, String, null: true
    field :public_name, String, null: true
    field :status, String, null: true
    field :upsell_campaigns, [Types::UpsellCampaignType], null: true
  end
end
