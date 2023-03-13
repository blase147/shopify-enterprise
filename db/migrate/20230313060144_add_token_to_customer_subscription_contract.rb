class AddTokenToCustomerSubscriptionContract < ActiveRecord::Migration[6.0]
    def change
      add_column :customer_subscription_contracts, :token, :string, unique: true
    end
end