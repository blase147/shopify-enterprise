class CombinedUserShopChildUserShopChildSettingShopUserToUserShop < ActiveRecord::Migration[6.0]
  def change
    add_reference :user_shops, :shop, foreign_key: true
    remove_reference :shops, :user_shop, foreign_key: true
    add_column :user_shops, :role, :string
    add_column :user_shops, :access_settings, :json
  end
end
