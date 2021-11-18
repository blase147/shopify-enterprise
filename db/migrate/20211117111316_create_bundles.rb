class CreateBundles < ActiveRecord::Migration[6.0]
  def change
    create_table :bundles do |t|
      t.references :bundle_group, null: false, foreign_key: true
      t.integer :quantity_limit
      t.decimal :box_price
      t.decimal :price_per_item
      t.string :label

      t.timestamps
    end
  end
end
