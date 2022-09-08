class AddCancelLaterToCustomerSubscriptionContract < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :cancel_later, :date
  end
end
