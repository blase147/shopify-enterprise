class AddBoxSubscriptionFields < ActiveRecord::Migration[6.0]
  def change
    remove_column :selling_plans, :build_a_box_min_number, :string
    remove_column :selling_plans, :build_a_box_max_number, :string
    remove_column :selling_plans, :build_a_box_duration, :string
    remove_column :selling_plans, :build_a_box_duration_value, :string
    add_column :selling_plans, :box_subscription_type, :integer
    add_column :selling_plans, :box_is_quantity, :boolean
    add_column :selling_plans, :box_is_quantity_limited, :boolean
    add_column :selling_plans, :box_quantity_limit, :integer
  end
end
