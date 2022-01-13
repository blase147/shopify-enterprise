class AddImportDataAndImportTypeToCustomerSubscriptionContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :import_data, :json
    add_column :customer_subscription_contracts, :import_type, :string
  end
end
