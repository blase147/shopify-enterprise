class CreateShopUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :shop_users do |t|
      t.references :shop, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role

      t.timestamps
    end
  end
end
