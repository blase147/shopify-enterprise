class AddAccountPortalOptionToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :account_portal_option, :string
  end
end
