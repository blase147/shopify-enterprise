class AddProductVariantsToSellingPlanGroup < ActiveRecord::Migration[6.0]
  def change
    remove_column :selling_plans, :product_ids, :json
    remove_column :selling_plans, :variant_ids, :json

    add_column :selling_plan_groups, :product_ids, :json
    add_column :selling_plan_groups, :variant_ids, :json
  end
end
