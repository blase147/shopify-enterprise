class AddPreOrderTryBeforeYouBuyFieldsToSellingPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :checkout_charge_type, :string
    add_column :selling_plans, :checkout_charge_value, :string
    add_column :selling_plans, :remaing_balance_charge_trigger, :string
    add_column :selling_plans, :remaing_balance_charge_exact_time, :date
    add_column :selling_plans, :fulfillment_trigger, :string
    add_column :selling_plans, :reserve, :string
    add_column :selling_plans, :remaining_balance_charge_time, :date    
  end
end
