module Types
  class SingleOrderType < Types::BaseObject
    field :order_items, [Types::OrderLineItemType], null: true
    field :estimated_date_of_delivery, String, null: true
    field :created_at, String, null: true    

    def order_items
      object.line_items
    end

    def estimated_date_of_delivery
      (Date.parse(object.created_at)+2.days).to_s
    end

    def created_at
      (Date.parse(object.created_at)).to_s
    end
  end
end
