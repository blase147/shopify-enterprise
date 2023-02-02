module Queries
  class FetchEstimatedShippingRates < Queries::BaseQuery
    type [Types::ShippingRateType], null: true
    argument :id, ID, required: true

    def resolve(id:)
      order = current_shop.ship_engine_orders.find(id)
      rates = ShipEngineService::FetchRates.new(current_shop, order).fetch
      rates.sort_by{ |rate| rate['shipping_amount']['amount'] }
    end
  end
end
