module Types
  class AmountType < Types::BaseObject
    field :currency, String, null: true
    field :amount, String, null: true
  end
end
