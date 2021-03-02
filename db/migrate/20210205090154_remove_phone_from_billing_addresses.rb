class RemovePhoneFromBillingAddresses < ActiveRecord::Migration[6.0]
  def change
    remove_column :billing_addresses, :phone
  end
end
