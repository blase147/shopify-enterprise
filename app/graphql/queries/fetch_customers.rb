module Queries
  class FetchCustomers < Queries::BaseQuery

    type [Types::CustomerSubscriptionType], null: false

    def resolve
      current_shop.customers.order(created_at: :desc)
    end
  end
end