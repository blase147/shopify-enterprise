module Types
  class FetchCustomerMealType < Types::BaseObject
    field :pre_order, [Types::CustomerMealsOrdersType], null: true
    field :contracts, [Types::CustomerSubscriptionType], null: true
  end
end
