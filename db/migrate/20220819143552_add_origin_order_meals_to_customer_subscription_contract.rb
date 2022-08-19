class AddOriginOrderMealsToCustomerSubscriptionContract < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_subscription_contracts, :origin_order_meals, :json
  end
end
