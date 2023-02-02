module Queries
  class FetchShipEngineOrders < Queries::BaseQuery
    type Types::ShipEngineOrderCollectionType, null: false
    # argument :offset_attributes, Types::Input::OffsetAttributes, required: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      # offset_params = args[:offset_attributes].to_h
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      ship_engine_orders = current_shop.ship_engine_orders.order(created_at: :desc)#.limit(offset_params[:limit]).offset(offset_params[:offset])
      { ship_engine_orders: ship_engine_orders, total_count: current_shop.ship_engine_orders.count }
    end
  end
end

