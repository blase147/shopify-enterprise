class CreatePasswordlessOtps < ActiveRecord::Migration[6.0]
  def change
    create_table :passwordless_otps do |t|
      t.string :email, unique: true
      t.integer :otp

      t.timestamps
    end
  end
end
