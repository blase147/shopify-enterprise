class AddManageStaffToUserShopChildSetting < ActiveRecord::Migration[6.0]
  def change
    add_column :user_shop_child_settings, :manage_staff, :boolean, default: false
  end
end
