class AddManualBillingShipmentDatesToPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :selling_plans, :billing_dates, :text, array: true, default: []
    add_column :selling_plans, :shipping_dates, :text, array: true, default: []
  end
end
