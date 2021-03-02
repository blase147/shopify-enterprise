class AddStoreInformationToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :store_name, :string
    add_column :settings, :store_email, :string
    add_column :settings, :storefront_password, :string
  end
end
