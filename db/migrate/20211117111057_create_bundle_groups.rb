class CreateBundleGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :bundle_groups do |t|
      t.references :shop, null: false, foreign_key: true
      t.string :internal_name
      t.string :location
      t.date :start_date
      t.date :end_date
      t.string :box_type
      t.jsonb :collections
      t.jsonb :product_images
      t.json :triggers
      t.json :selling_plans
      t.boolean :fixed_pricing

      t.timestamps
    end
  end
end
