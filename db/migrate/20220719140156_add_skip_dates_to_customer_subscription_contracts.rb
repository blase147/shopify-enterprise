class AddSkipDatesToCustomerSubscriptionContracts < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :skip_dates, :text, array: true, default: []
  end
end
