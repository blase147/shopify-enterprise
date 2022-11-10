class AddWaysToEarnAndCustomerModalToUserShopChildSetting < ActiveRecord::Migration[6.0]
  def change
    add_column :user_shop_child_settings, :ways_to_earn, :boolean, default: false
    add_column :user_shop_child_settings, :customer_modal, :boolean, default: false
  end
end
