class AddAttributesToSellingPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :trial_interval_type, :string
    add_column :selling_plans, :trial_interval_count, :string
    add_column :selling_plans, :trial_adjustment_type, :string
    add_column :selling_plans, :trial_adjustment_value, :string
  end
end
