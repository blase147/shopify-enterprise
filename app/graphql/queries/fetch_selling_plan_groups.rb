module Queries
  class FetchSellingPlanGroups < Queries::BaseQuery

    type [Types::SellingPlanGroupType], null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.selling_plan_groups.order(created_at: :desc)
    end
  end
end