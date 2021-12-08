module Queries
  class FetchCustomer < Queries::BaseQuery
    type Types::CustomerSubscriptionType, null: false
    argument :id, ID, required: true

    def resolve(id:)
      current_shop.customer_subscription_contracts.find(id)
    end
  end
end
