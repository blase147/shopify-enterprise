class AddAttrsSubscriptionLogs < ActiveRecord::Migration[6.0]
  def change
    add_column :subscription_logs, :revenue, :decimal, precision: 5, scale: 2
    add_column :subscription_logs, :product_id, :string
    add_column :subscription_logs, :swaped_product_id, :string
    add_column :subscription_logs, :description, :string
    add_column :subscription_logs, :log_type, :integer, default: 0
    add_column :subscription_logs, :amount , :string
    add_column :subscription_logs, :product_name, :string
    add_column :subscription_logs, :note, :string
    add_column :customers, :biiling_interval, :string
  end
end
