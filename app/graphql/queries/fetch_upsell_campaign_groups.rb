module Queries
  class FetchUpsellCampaignGroups < Queries::BaseQuery

    type [Types::UpsellCampaignGroupType], null: false

    def resolve
      current_shop.upsell_campaign_groups.order(created_at: :desc)
    end
  end
end