class CreateTableShipengineOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :ship_engine_orders do |t|
      t.string :order_id
      t.datetime :order_date
      t.json :payment_details
      t.json :customer
      t.json :ship_to
      t.json :order_items
      t.json :order_status
      t.references :shop
      t.datetime :due_date
      t.string :shipping_interval
      t.integer :shipping_interval_count
      t.integer :status, default: 0
      t.timestamps
    end
  end
end
