class CreateRebuys < ActiveRecord::Migration[6.0]
  def change
    create_table :rebuys do |t|
      t.references :shop, null: false, foreign_key: true
      t.string :token
      t.text :purchased_products, array: true, default: []
      t.text :other_products, array: true, default: []
      t.references :customer_modal, null: false, foreign_key: true

      t.timestamps
    end
  end
end
