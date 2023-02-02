module Queries
  class FetchSellingPlanByName < Queries::BaseQuery
    type [Types::SellingPlanType], null: false
    argument :name, String, required: true
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      sellingPlanGroupIds =  current_shop.selling_plan_groups.pluck(:id)
      result = SellingPlan.where(selling_plan_group_id: sellingPlanGroupIds).where("LOWER(name) LIKE LOWER(?)", "%#{args[:name]}%")
    end
  end
end
