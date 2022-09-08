class AddPauseLaterToCustomerSubscriptionContract < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :pause_later, :date
  end
end
