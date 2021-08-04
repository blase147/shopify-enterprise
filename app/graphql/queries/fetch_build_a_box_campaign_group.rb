module Queries
  class FetchBuildABoxCampaignGroup < Queries::BaseQuery
    type Types::BuildABoxCampaignGroupType, null: false
    argument :id, ID, required: true

    def resolve(id:)
      current_shop.build_a_box_campaign_groups.find(id)
    end
  end
end
