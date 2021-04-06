class CreateRemovedSubsctiptionLinesTable < ActiveRecord::Migration[6.0]
  def change
    create_table :removed_subscription_lines do |t|
      t.string :subscription_id
      t.string :customer_id
      t.string :variant_id
      t.integer :quantity
    end
  end
end
