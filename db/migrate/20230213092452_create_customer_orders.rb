class CreateCustomerOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :customer_orders do |t|
      t.string :order_id
      t.string :status
      t.references :customer_modal, null: false, foreign_key: true
      t.references :shop, null: false, foreign_key: true
      t.text :api_data

      t.timestamps
    end
  end
end
