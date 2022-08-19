class AddColumnsDeliveryDayDeliveryDateToCustomerSubscriptionContract < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :delivery_day, :string
    add_column :customer_subscription_contracts, :delivery_date, :date
  end
end
