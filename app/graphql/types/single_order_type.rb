module Types
  class SingleOrderType < Types::BaseObject
    field :order_items, [Types::OrderLineItemType], null: true

    def order_items
      object.line_items
    end
  end
end
