class CreateUserShops < ActiveRecord::Migration[6.0]
  def change
    create_table :user_shops do |t|
      t.references :shop, foreign_key: true
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end