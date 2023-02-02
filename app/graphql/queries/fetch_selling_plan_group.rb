module Queries
  class FetchSellingPlanGroup < Queries::BaseQuery
    type Types::SellingPlanGroupType, null: false
    argument :id, ID, required: true

    def resolve(id:)
      if id.include?('gid://shopify')
        current_shop.selling_plan_groups.find_by_shopify_id(id)
      else
        current_shop.selling_plan_groups.find(id)
      end
    end
  end
end
