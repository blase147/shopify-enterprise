class CreateWorldfarePreOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :worldfare_pre_orders do |t|
      t.integer :shop_id
      t.integer :customer_id
      t.string :week
      t.string :products

      t.timestamps
    end
  end
end
