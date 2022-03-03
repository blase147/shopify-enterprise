module Queries
  class FetchCustomersMealsOrders < Queries::BaseQuery
    type [Types::CustomerMealsOrdersType], null: false
    # argument :week, String, required: false

    def resolve
      ShopifyAPI::Customer.find(:all)
    end
  end
end
