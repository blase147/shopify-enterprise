class AddColumnsToSmsSettings < ActiveRecord::Migration[6.0]
  def change
    remove_column :sms_settings, :edit_delivery_schedule, :boolean
    remove_column :sms_settings, :skip_upcoming_order, :boolean
    add_column :sms_settings, :opt_in, :boolean, default: false
    add_column :sms_settings, :swap_product, :boolean, default: false
    add_column :sms_settings, :update_billing, :boolean, default: false
  end
end
