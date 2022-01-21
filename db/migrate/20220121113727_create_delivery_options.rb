class CreateDeliveryOptions < ActiveRecord::Migration[6.0]
  def change
    create_table :delivery_options do |t|
      t.integer :shop_id
      t.integer :delivery_option
      t.text :settings

      t.timestamps
    end
  end
end
