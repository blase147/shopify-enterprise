module Queries
  class FetchSellingPlanGroups < Queries::BaseQuery

    type [Types::SellingPlanGroupType], null: false

    def resolve
      current_shop.selling_plan_groups.order(created_at: :desc)
    end
  end
end