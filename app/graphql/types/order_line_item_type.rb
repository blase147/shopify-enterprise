module Types
  class OrderLineItemType < Types::BaseObject
    field :name, String, null: true
    field :quantity, Int, null: true
    field :product_id, String, null: true

    def name
      object.name
    end

    def quantity
      object.quantity
    end

    def product_id
      object.product_id
    end
  end
end
