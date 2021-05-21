class CreateSubscriptionLogsTable < ActiveRecord::Migration[6.0]
  def change
    create_table :subscription_logs do |t|
      t.integer :billing_status, default: 0
      t.integer :action_type, default: 0
      t.string :subscription_id
      t.references :shop
      t.timestamps
    end
  end
end
