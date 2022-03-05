module Types
  class SingleOrderType < Types::BaseObject
    field :order_items, [Types::OrderLineItemType], null: true
    field :date_of_delivery, String, null: true
    field :created_at, String, null: true
    field :products, [Types::OrderProductType], null: true

    def order_items
      object.line_items
    end

    def date_of_delivery
      # "Sunday 13 Mar 2022"
      object.note
    end

    def products
      ShopifyAPI::Product.where(ids: object.line_items.map(&:product_id).join(', '), fields: 'id,title,images')
    end

    def created_at
      (Date.parse(object.created_at)).to_s
    end
  end
end
