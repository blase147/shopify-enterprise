module Types
  class ShipEngineOrderCollectionType < Types::BaseObject
    field :total_count, Integer, null: true
    field :ship_engine_orders, [Types::ShipEngineOrderType], null: true
  end
end
