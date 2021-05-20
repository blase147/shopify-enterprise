class CreateSmsLogsTable < ActiveRecord::Migration[6.0]
  def change
    create_table :sms_logs do |t|
      t.references :shop
      t.references :customer
      t.integer :action, default: 0
      t.decimal :revenue, precision: 5, scale: 2
      t.string :product_id
      t.string :swaped_product_id
      t.timestamps
    end
  end
end
