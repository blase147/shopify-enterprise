module Queries
  class FetchBuildABoxCampaignGroups < Queries::BaseQuery

    type [Types::BuildABoxCampaignGroupType], null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.build_a_box_campaign_groups.order(created_at: :desc)
    end
  end
end
