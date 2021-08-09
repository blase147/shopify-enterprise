module Types
  class ShippingRateType < Types::BaseObject
    field :rate_id, String, null: true
    field :carrier_id, String, null: true
    field :shipping_amount, Types::AmountType, null: true
    field :delivery_days, Int, null: true
    field :estimated_delivery_date, String, null: true
    field :ship_date, String, null: true
    field :service_type, String, null: true
    field :carrier_code, String, null: true
    field :carrier_nickname, String, null: true
  end
end
