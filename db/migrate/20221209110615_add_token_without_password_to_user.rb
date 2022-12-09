class AddTokenWithoutPasswordToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :token_without_password, :string
  end
end
