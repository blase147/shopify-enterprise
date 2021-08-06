module Types
  class AddressType < Types::BaseObject
    field :company_name, String, null: true
    field :name, String, null: true
    field :email, String, null: true
    field :phone, String, null: true
    field :state, String, null: true
    field :address1, String, null: true
    field :city, String, null: true
    field :zip, String, null: true
    field :country_code, String, null: true
    field :province_code, String, null: true
  end
end
