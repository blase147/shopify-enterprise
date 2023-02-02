module Queries
  class FetchDeliveryOptions < Queries::BaseQuery
    type [Types::DeliveryOptionType], null: false

    def resolve
      settings = DeliveryOption.where(shop_id: current_shop.id).last.settings
      JSON.parse(settings)
    end
  end
end
