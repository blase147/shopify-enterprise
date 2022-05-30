module Queries
  class FetchCustomersMealsOrders < Queries::BaseQuery
    type [Types::CustomerMealsOrdersType], null: false

    def resolve
      WorldfarePreOrder.all
    end
  end
end
