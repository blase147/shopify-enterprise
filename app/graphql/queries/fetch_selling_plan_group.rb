module Queries
  class FetchSellingPlanGroup < Queries::BaseQuery
    type Types::SellingPlanGroupType, null: false
    argument :id, ID, required: true

    def resolve(id:)
      current_shop.selling_plan_groups.find(id)
    end
  end
end