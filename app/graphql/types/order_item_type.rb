module Types
  class OrderItemType < Types::BaseObject
    field :name, String, null: true
    field :sku, String, null: true
    field :unit_price, String, null: true
    field :quantity, Int, null: true
    field :weight, String, null: true
    field :weight_unit, String, null: true
    field :length, String, null: true
    field :width, String, null: true
    field :height, String, null: true
    field :dimension_unit, GraphQL::Types::Boolean, null: true
  end
end
