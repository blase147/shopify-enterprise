class CreateStripeContracts < ActiveRecord::Migration[6.0]
  def change
    create_table :stripe_contracts do |t|
      t.references :shop, null: false, foreign_key: true
      t.references :customer_modal, null: false, foreign_key: true
      t.string :stripe_product_id

      t.timestamps
    end
  end
end
