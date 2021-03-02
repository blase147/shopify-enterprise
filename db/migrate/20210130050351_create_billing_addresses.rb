class CreateBillingAddresses < ActiveRecord::Migration[6.0]
  def change
    create_table :billing_addresses do |t|
      t.string :language
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :company
      t.integer :phone
      t.string :address_1
      t.string :address_2
      t.string :city
      t.string :zip_code
      t.integer :customer_id

      t.timestamps
    end
  end
end
