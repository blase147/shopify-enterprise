module Queries
  class FetchCustomers < Queries::BaseQuery

    type [Types::CustomerSubscriptionType], null: false

    def resolve
      current_shop.sync_contracts
      current_shop.customers.order(shopify_at: :desc)
    end
  end
end