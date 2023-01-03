class CreateUsageCharges < ActiveRecord::Migration[6.0]
  def change
    create_table :usage_charges do |t|
      t.bigint :shopify_id
      t.string :description
      t.string :price
      t.datetime :billing_on
      t.string :balance_used
      t.string :balance_remaining
      t.string :risk_level
      t.references :shop, null: false, foreign_key: true
      t.bigint :reccuring_charge_id

      t.timestamps
    end
  end
end
