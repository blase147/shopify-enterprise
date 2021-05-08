class AddColumnsToSmsSettings < ActiveRecord::Migration[6.0]
  def change
    remove_column :sms_settings, :failed_renewal, :boolean
    remove_column :sms_settings, :skip_upcoming_order, :boolean
    add_column :sms_settings, :swap_product, :boolean, default: false
    add_column :sms_settings, :update_billing_detail, :boolean, default: false
    add_column :sms_settings, :update_shipping_detail, :boolean, default: false
  end
end
