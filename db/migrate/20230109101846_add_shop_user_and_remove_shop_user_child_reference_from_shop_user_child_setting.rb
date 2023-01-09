class AddShopUserAndRemoveShopUserChildReferenceFromShopUserChildSetting < ActiveRecord::Migration[6.0]
  def change
    remove_reference :user_shop_child_settings, :user_shop_child, foreign_key: true
    add_reference :user_shop_child_settings, :shop_user, foreign_key: true
  end
end
