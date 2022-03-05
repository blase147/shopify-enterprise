module Types
  class DeliveryOptionType < Types::BaseObject
    field :delivery_days, String, null: true

    def delivery_days
      object["delivery"]
    end
  end
end
