class AddFieldsToSellingPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :shipping_cut_off, :integer
    add_column :selling_plans, :first_delivery, :string
  end
end
