class CreateUserShopChildren < ActiveRecord::Migration[6.0]
  def change
    create_table :user_shop_children do |t|
      t.references :user_shop
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end