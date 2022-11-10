class ChangeShopIdOfUserShop < ActiveRecord::Migration[6.0]
  def change
    change_column :user_shops, :shop_id, :bigint, null: true
  end
end