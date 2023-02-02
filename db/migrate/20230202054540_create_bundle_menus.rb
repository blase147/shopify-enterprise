class CreateBundleMenus < ActiveRecord::Migration[6.0]
  def change
    create_table :bundle_menus do |t|
      t.references :shop, null: false, foreign_key: true
      t.references :selling_plan, null: true, foreign_key: true
      t.string :title
      t.json :product_images
      t.json :collection_images

      t.timestamps
    end
  end
end
