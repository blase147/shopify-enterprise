class AddActionByToSubscriptionLog < ActiveRecord::Migration[6.0]
  def change
    add_column :subscription_logs, :action_by, :string
  end
end
