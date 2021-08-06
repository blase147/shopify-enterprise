module Types
  class PaymentDetailType < Types::BaseObject
    field :subtotal_amount, String, null: true
    field :shipping_amount, String, null: true
    field :tax, String, null: true
    field :grand_total, String, null: true
  end
end
