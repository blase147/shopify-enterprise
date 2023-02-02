module Queries
  class FetchDeliveryOptions < Queries::BaseQuery
    type [Types::DeliveryOptionType], null: false

    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      settings = DeliveryOption.where(shop_id: current_shop.id).last.settings
      JSON.parse(settings)
    end
  end
end