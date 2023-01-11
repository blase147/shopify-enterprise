class RemoveUserShopChildShopUserUserShopChildSetting < ActiveRecord::Migration[6.0]
  def change
    drop_table :user_shop_children
    drop_table :user_shop_child_settings
    drop_table :shop_users
  end
end
