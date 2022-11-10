class ChangeRelationOfUserShopToShop < ActiveRecord::Migration[6.0]
  def change
    remove_column :user_shops, :shop_id
    add_reference :shops, :user_shop, foreign_key: true, null: true
  end
end