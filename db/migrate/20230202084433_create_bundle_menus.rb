class CreateBundleMenus < ActiveRecord::Migration[6.0]
  def change
    create_table :bundle_menus do |t|
      t.references :shop, null: false, foreign_key: true
      t.string :title
      t.string :subheading_i
      t.string :subheading_ii
      t.string :subheading_iii
      t.string :bundle_style
      t.json :selling_plans
      t.json :selling_plan_ids
      t.json :product_images
      t.json :collection_images
      t.integer :break_point_price_i
      t.integer :break_point_price_ii
      t.integer :break_point_price_iii
      t.integer :number_of_options
      t.json :free_product_collections
      t.json :free_products_images
      

      t.timestamps
    end
  end
end
