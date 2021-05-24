class AddExecutionsToSubscriptionLogs < ActiveRecord::Migration[6.0]
  def change
  	add_column :subscription_logs, :executions, :boolean, default: false
  end
end
