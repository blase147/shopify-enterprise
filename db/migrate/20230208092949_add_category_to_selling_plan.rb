class AddCategoryToSellingPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :category, :string
  end
end
