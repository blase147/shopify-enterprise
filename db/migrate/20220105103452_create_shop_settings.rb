class CreateShopSettings < ActiveRecord::Migration[6.0]
  def change
    create_table :shop_settings do |t|
      t.integer :shop_id
      t.boolean :debug_mode

      t.timestamps
    end
  end
end
