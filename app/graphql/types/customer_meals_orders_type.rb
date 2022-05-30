module Types
  class CustomerMealsOrdersType < Types::BaseObject
    field :week, String, null: true
    field :products, [Types::SingleOrderType], null: true
    field :shopify_contract_id, String, null: true
    field :customer, Types::PreOrderCustomerType, null: false
    field :delivery_date, String, null: true

    def products
      products_to_display = []
      week = object.week
      weekly_menu_products = WeeklyMenu.where(week: week).first&.collection_images&.last["products"] rescue nil
      weekly_menu_products = WeeklyMenu.where(week: week).first&.product_images if weekly_menu_products.blank?

      return [] if weekly_menu_products.blank?

      selected_products = JSON.parse(object.products)
      selected_products.each do |product|
        products_to_display << weekly_menu_products.filter{|p| p["product_id"].split('/').last == product }.first
      end
      products_to_display
    end

    def delivery_date
      Date.today
    end

    def customer
      CustomerSubscriptionContract.find_by(shopify_customer_id: object.customer_id)
    end
  end
end