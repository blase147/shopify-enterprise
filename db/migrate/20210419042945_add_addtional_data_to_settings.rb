class AddAddtionalDataToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :show_subscription, :boolean, default: true
    add_column :settings, :show_delivery_schedule, :boolean, default: true
    add_column :settings, :show_order_history, :boolean, default: true
    add_column :settings, :show_address, :boolean, default: true
    add_column :settings, :show_billing, :boolean, default: true
    add_column :settings, :show_account, :boolean, default: true
    add_column :settings, :delay_order, :string
    add_column :settings, :pause_subscription, :string
  end
end
