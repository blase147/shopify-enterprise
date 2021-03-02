class AddAdditionalSettingToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :additional_send_account_after_checkout, :boolean
    add_column :settings, :bbc_storeowner, :boolean
    add_column :settings, :cc_storeowner, :boolean
    add_column :settings, :send_shopify_receipt, :boolean
    add_column :settings, :send_fullfillment, :boolean
  end
end
