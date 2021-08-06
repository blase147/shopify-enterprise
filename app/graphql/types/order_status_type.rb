module Types
  class OrderStatusType < Types::BaseObject
    field :payment_status, String, null: true
    field :fulfillment_status, String, null: true
    field :is_cancelled, GraphQL::Types::Boolean, null: true
  end
end
