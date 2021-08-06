module Mutations
  class UpdateShipEngineOrder < Mutations::BaseMutation
    argument :params, Types::Input::ShipEngineOrderInputType, required: true
    field :ship_engine_order, Types::ShipEngineOrderType, null: false

    def resolve(params:)
      order_params = Hash params
      begin
        ship_engine_order = current_shop.ship_engine_orders.find_by(id: params[:id])
        ship_engine_order.update!(order_params)

        { ship_engine_order: ship_engine_order }
      rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
