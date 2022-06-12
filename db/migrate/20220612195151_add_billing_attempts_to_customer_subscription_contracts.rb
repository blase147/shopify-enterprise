class AddBillingAttemptsToCustomerSubscriptionContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :billing_attempts, :json
  end
end
