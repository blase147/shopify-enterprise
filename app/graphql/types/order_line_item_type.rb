module Types
  class OrderLineItemType < Types::BaseObject
    field :name, String, null: true
    field :quantity, Int, null: true

    def name
      item_name =  object.name
      puts item_name
      object.name
    end

    def quantity
      object.quantity
    end
  end
end
