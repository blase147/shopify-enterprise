module Queries
  class FetchBuildABoxCampaignGroup < Queries::BaseQuery
    type Types::BuildABoxCampaignGroupType, null: false
    argument :id, ID, required: true
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.build_a_box_campaign_groups.find(args[:id])
    end
  end
end