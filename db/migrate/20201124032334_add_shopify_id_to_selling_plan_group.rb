class AddShopifyIdToSellingPlanGroup < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plan_groups, :shop_id, :integer
    add_column :selling_plan_groups, :shopify_id, :string
    add_column :selling_plans, :shopify_id, :string
  end
end
