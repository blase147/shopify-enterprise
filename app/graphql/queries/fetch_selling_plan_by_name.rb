module Queries
  class FetchSellingPlanByName < Queries::BaseQuery
    type [Types::SellingPlanType], null: false
    argument :name, String, required: true

    def resolve(name:)
      sellingPlanGroupIds =  current_shop.selling_plan_groups.pluck(:id)
      result = SellingPlan.where(selling_plan_group_id: sellingPlanGroupIds).where("LOWER(name) LIKE LOWER(?)", "%#{name}%")
    end
  end
end