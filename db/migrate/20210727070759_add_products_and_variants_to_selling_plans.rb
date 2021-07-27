class AddProductsAndVariantsToSellingPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plan_groups, :product_ids, :json
    add_column :selling_plan_groups, :variant_ids, :json
  end
end
