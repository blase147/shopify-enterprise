class ChangeColumnNameForLockPassword < ActiveRecord::Migration[6.0]
  def change
    rename_column :lock_passwords, :encrypted_password, :password_digest
  end
end
