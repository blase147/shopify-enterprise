module Queries
  class FetchEstimatedShippingRates < Queries::BaseQuery
    type [Types::ShippingRateType], null: true
    argument :id, ID, required: true
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      order = current_shop.ship_engine_orders.find(args[:id])
      rates = ShipEngineService::FetchRates.new(current_shop, order).fetch
      rates.sort_by{ |rate| rate['shipping_amount']['amount'] }
    end
  end
end
