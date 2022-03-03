module Types
  class CustomerMealsOrdersType < Types::BaseObject
    field :total_count, Integer, null: true
    field :customer_name, String, null: true
    field :customer_orders, [Types::SingleOrderType], null: true

    def total_count
      object.orders.count
    end

    def customer_name
      "#{object.first_name} #{object.last_name}"
    end

    def customer_orders
      object.orders if object.orders.any?
    end
  end
end
