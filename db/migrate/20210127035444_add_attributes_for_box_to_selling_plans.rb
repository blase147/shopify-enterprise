class AddAttributesForBoxToSellingPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :build_a_box_min_number, :string
    add_column :selling_plans, :build_a_box_max_number, :string
    add_column :selling_plans, :build_a_box_duration, :string
    add_column :selling_plans, :build_a_box_duration_value, :string
    add_column :selling_plans, :mystery_duration, :string
    add_column :selling_plans, :mystery_duration_value, :string
  end
end
