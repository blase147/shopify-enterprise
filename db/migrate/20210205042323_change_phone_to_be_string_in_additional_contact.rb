class ChangePhoneToBeStringInAdditionalContact < ActiveRecord::Migration[6.0]
  def change
    change_column :additional_contacts, :phone, :string
  end
end
