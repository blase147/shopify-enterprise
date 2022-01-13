class ChangeCustomerToSubscriptionContract < ActiveRecord::Migration[6.0]
  def change
    rename_table :customers, :customer_subscription_contracts
    add_column :customer_subscription_contracts, :api_source, :string
    add_column :customer_subscription_contracts, :api_data, :json # unstructured but flexible and faster to refactor
    rename_column :customer_subscription_contracts, :biiling_interval, :billing_interval
  end
end
