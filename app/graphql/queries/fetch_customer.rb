module Queries
  class FetchCustomer < Queries::BaseQuery
    type Types::CustomerSubscriptionType, null: false
    argument :id, ID, required: true

    def resolve(id:)
      # byebug 
      current_shop.customers.find(id)
    end
  end
end
