class AddDeliveryRulesToSellingPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :delivery_interval_type, :string
    add_column :selling_plans, :delivery_interval_count, :integer
  end
end
