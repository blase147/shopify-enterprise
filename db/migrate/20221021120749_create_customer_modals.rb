class CreateCustomerModals < ActiveRecord::Migration[6.0]
  def change
    create_table :customer_modals do |t|
      t.bigint :shopify_id
      t.string :email, unique: true
      t.string :first_name
      t.string :last_name
      t.text :contracts, array: true, default: []

      t.timestamps
    end
  end
end
