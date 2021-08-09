class AddColumnsToShipEngineOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :ship_engine_orders, :signature_confirmation, :boolean, deafult: false
    add_column :ship_engine_orders, :signature_insurance, :boolean, deafult: false
    add_column :ship_engine_orders, :create_return_label, :boolean, deafult: false
    add_column :ship_engine_orders, :contains_alcohol, :boolean, deafult: false
  end
end
