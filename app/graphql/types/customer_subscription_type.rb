module Types
  class CustomerSubscriptionType < Types::BaseObject
    field :id, ID, null: false
    field :shopify_id, ID, null: false
    field :shop_domain, String, null: false
    field :first_name, String, null: true
    field :last_name, String, null: true
    field :name, String, null: true
    field :email, String, null: false
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
  end
end
