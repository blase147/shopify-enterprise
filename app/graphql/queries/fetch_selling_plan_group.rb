module Queries
  class FetchSellingPlanGroup < Queries::BaseQuery
    type Types::SellingPlanGroupType, null: false
    argument :id, ID, required: true
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      if args[:id]&.include?('gid://shopify')
        current_shop.selling_plan_groups.find_by_shopify_id(args[:id])
      else
        current_shop.selling_plan_groups.find(args[:id])
      end
    end
  end
end
