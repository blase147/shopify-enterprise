module Queries
  class FetchBuildABoxCampaignGroups < Queries::BaseQuery

    type [Types::BuildABoxCampaignGroupType], null: false

    def resolve
      current_shop.build_a_box_campaign_groups.order(created_at: :desc)
    end
  end
end
