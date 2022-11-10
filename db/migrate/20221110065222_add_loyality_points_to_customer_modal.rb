class AddLoyalityPointsToCustomerModal < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_modals, :loyalty_points, :float
  end
end
