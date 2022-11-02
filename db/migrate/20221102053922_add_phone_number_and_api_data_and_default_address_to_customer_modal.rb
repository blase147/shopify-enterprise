class AddPhoneNumberAndApiDataAndDefaultAddressToCustomerModal < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_modals, :phone, :string
    add_column :customer_modals, :api_data, :json
    add_column :customer_modals, :country, :string
    add_column :customer_modals, :zip_code, :string
    add_column :customer_modals, :city, :string
    add_column :customer_modals, :address_phone_number, :string
    add_column :customer_modals, :state, :string
  end
end
