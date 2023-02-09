module Types
  class StripeContractType < Types::BaseObject
    field :id, ID, null: false
    field :customer_name, String, null: true
    field :customer_email, String, null: true
    field :stripe_product_name, String, null: true
    field :checked_out, Boolean, null: true
    field :created_at, String, null: true
    field :token, String, null: true

    def created_at
      object.created_at&.strftime('%b %d %Y, %I:%M %p')
    end

    def customer_name
      "#{object.customer_modal.name}"
    end

    def customer_email
      "#{object.customer_modal.email}"
    end

  end
end
