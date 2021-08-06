class AddShipFromDetailToShipEngineOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :ship_engine_orders, :ship_from, :json
  end
end
