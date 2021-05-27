class CreateLockPasswords < ActiveRecord::Migration[6.0]
  def change
    create_table :lock_passwords do |t|
      t.integer :shop_id
      t.string :encrypted_password, null: false 

      t.timestamps default: -> { "CURRENT_TIMESTAMP" }
    end
  end
end
