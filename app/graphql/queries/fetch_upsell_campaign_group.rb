module Queries
  class FetchUpsellCampaignGroup < Queries::BaseQuery
    type Types::UpsellCampaignGroupType, null: false
    argument :id, ID, required: true
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.upsell_campaign_groups.find(args[:id])
    end
  end
end