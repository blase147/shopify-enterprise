class AddRecurringChargeIdToShop < ActiveRecord::Migration[6.0]
  def change
    add_column :shops, :recurring_charge_id, :string
    add_column :shops, :recurring_charge_status, :string
    add_column :shops, :charge_confirmation_link, :string
  end
end
