class AddSellingPlanIdToCustomerSubscriptionContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :selling_plan_id, :string
    add_index :customer_subscription_contracts, :selling_plan_id
  end
end
