class AddShopToWeeklyMenus < ActiveRecord::Migration[6.0]
  def change
    add_column :weekly_menus, :shop_id, :integer
  end
end
