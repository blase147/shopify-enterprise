class AddPlanTypeToSellingPlanGroup < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plan_groups, :plan_type, :integer
    add_column :selling_plan_groups, :billing_plan, :string
    add_column :selling_plan_groups, :price, :decimal
    add_column :selling_plan_groups, :trial, :integer
    add_column :selling_plan_groups, :active, :boolean, default: true
  end
end
