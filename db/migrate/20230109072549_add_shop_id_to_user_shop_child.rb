class AddShopIdToUserShopChild < ActiveRecord::Migration[6.0]
  def change
    add_reference :user_shop_children, :shop, foreign_key: true, null: true
  end
end
