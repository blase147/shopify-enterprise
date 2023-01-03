class CreatePendingRecurringCharges < ActiveRecord::Migration[6.0]
  def change
    create_table :pending_recurring_charges do |t|
      t.references :shop, null: false, foreign_key: true
      t.bigint :charge_id

      t.timestamps
    end
  end
end
