class AddTokenAndExpireTokenToUserShop < ActiveRecord::Migration[6.0]
  def change
    add_column :user_shops, :sign_out_after, :datetime
  end
end
