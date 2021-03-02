module Queries
  class FetchUpsellCampaignGroup < Queries::BaseQuery
    type Types::UpsellCampaignGroupType, null: false
    argument :id, ID, required: true

    def resolve(id:)
      current_shop.upsell_campaign_groups.find(id)
    end
  end
end