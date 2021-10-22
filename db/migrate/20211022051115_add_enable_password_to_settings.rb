class AddEnablePasswordToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :enable_password, :boolean, default: false
  end
end
