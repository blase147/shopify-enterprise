module Types
  class CustomerSubscriptionType < Types::BaseObject
    field :id, ID, null: false
    field :shopify_id, ID, null: true
    field :shop_domain, String, null: true
    field :first_name, String, null: true
    field :last_name, String, null: true
    field :name, String, null: true
    field :email, String, null: true
    field :communication, String, null: true
    field :language, String, null: true
    field :subscription, String, null: true
    field :status, String, null: true
    field :auto_collection, GraphQL::Types::Boolean, null: true
    field :phone, String, null: true
    field :additional_contacts, [Types::AdditionalContactType], null: true
    field :billing_address, Types::BillingAddressType, null: true
    field :pack, String, null: true
    field :frequency, String, null: true
    field :origin_order_products, [Types::OriginOrderProductsType], null: true
    field :week_number, String, null: true
    field :delivery_date, String, null: true
    field :api_data, String, null: true
    field :api_resource_id, String, null: true
    field :api_source, String, null: true
    field :delivery_day, String, null: true
    field :token, String, null: true

    field :created_at, String, null: true
    field :updated_at, String, null: true
    field :__typename, String, null: true

    def created_at
      object.shopify_at&.strftime('%b %d %Y, %I:%M %p')
    end

    def updated_at
      object.shopify_updated_at&.strftime('%b %d %Y, %I:%M %p')
    end

    def subscription
      object.subscription.truncate(30) rescue nil
    end

    # def status
    #   object.status&.capitalize
    # end

    # def subscription
    #   object.subscription&.capitalize
    # end

    def name
      "#{object.first_name} #{object.last_name}"
    end

    def shop_domain
      object.shop.shopify_domain
    end

    def week_number
      date = object.delivery_date
      Date.strptime(date, "%m/%d/%Y").to_date.cweek rescue 1
    end

    def delivery_date
      object.delivery_date
    end

    def delivery_day
      object.delivery_day
    end

    def origin_order_products
      if object.origin_order_meals.present?
        object.origin_order_meals
      end
    end

  end
end
