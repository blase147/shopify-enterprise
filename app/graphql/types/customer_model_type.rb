module Types
  class CustomerModelType < Types::BaseObject
    field :email, String, null: false
    field :name, String, null: true
    field :shopify_customer_id, String, null: true
    field :contracts,[CustomerSubscriptionType], null: false

    def name
      object&.second&.first&.name
    end
    def email
      object.first
    end
    def shopify_customer_id
      object&.second&.first&.shopify_customer_id
    end

    def contracts
      object&.second
    end

  end
end
