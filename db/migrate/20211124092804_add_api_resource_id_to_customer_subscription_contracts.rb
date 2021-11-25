class AddApiResourceIdToCustomerSubscriptionContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :api_resource_id, :string
  end
end
