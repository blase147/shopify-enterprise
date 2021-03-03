module Queries
  class FetchCustomers < Queries::BaseQuery

    type [Types::CustomerSubscriptionType], null: false

    def resolve
      current_shop.contracts
    end
  end
end