module Queries
  class FetchCustomersMealsOrders < Queries::BaseQuery
    type Types::FetchCustomerMealType, null: false

    def resolve
      {pre_order: WorldfarePreOrder.all, contracts: CustomerSubscriptionContract.all}
    end
  end
end
