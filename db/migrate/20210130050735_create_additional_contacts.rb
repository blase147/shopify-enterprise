class CreateAdditionalContacts < ActiveRecord::Migration[6.0]
  def change
    create_table :additional_contacts do |t|
      t.integer :customer_id
      t.string :email
      t.string :first_name
      t.string :last_name
      t.string :company_name
      t.integer :phone

      t.timestamps
    end
  end
end
