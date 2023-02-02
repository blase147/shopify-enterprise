module Queries
  class FetchShipEngineOrder < Queries::BaseQuery
    argument :id, String, required: true
    type Types::ShipEngineOrderType, null: false

    def resolve(id:)
      current_shop.ship_engine_orders.find(id)
    end
  end
end
