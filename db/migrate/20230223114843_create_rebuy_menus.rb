class CreateRebuyMenus < ActiveRecord::Migration[6.0]
  def change
    create_table :rebuy_menus do |t|
      t.string :interval_type
      t.integer :interval_count
      t.string :rebuy_type
      t.string :status
      t.references :shop, null: false, foreign_key: true

      t.json :product_images
      t.json :collection_images

      t.timestamps
    end
  end
end
