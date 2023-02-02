module Queries
  class FetchShipEngineOrder < Queries::BaseQuery
    argument :id, String, required: true
    argument :shop_domain, String, required: false
    type Types::ShipEngineOrderType, null: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.ship_engine_orders.find(args[:id])
    end
  end
end