module Types
  class ShipEngineOrderType < Types::BaseObject
    field :id, ID, null: false
    field :order_id, String, null: true
    field :order_date, String, null: true
    field :payment_details, Types::PaymentDetailType, null: true
    field :customer, Types::CustomerType, null: true
    field :ship_to, Types::AddressType, null: true
    field :ship_from, Types::AddressType, null: true
    field :order_items, [Types::OrderItemType], null: true
    field :order_status, Types::OrderStatusType, null: true
    field :due_date, String, null: true
    field :shipping_interval, String, null: true
    field :shipping_interval_count, Int, null: true
    field :status, String, null: true
    field :created_at, String, null: true
    field :updated_at, String, null: true
  end
end
