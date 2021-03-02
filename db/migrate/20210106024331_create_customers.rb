class CreateCustomers < ActiveRecord::Migration[6.0]
  def change
    create_table :customers do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :phone
      t.string :address_1
      t.string :address_2
      t.integer :gender
      t.string :communication
      t.string :avatar
      t.date :birthday
      t.string :shopify_id
      t.integer :shop_id

      t.timestamps
    end
  end
end
