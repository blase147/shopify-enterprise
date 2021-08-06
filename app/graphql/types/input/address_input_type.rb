module Types
  module Input
    class AddressInputType < Types::BaseInputObject
      argument :name, String, required: false
      argument :email, String, required: false
      argument :address1, String, required: false
      argument :phone, String, required: false
      argument :state, String, required: false
      argument :city, String, required: false
      argument :zip, String, required: false
      argument :country_code, String, required: false
      argument :province_code, String, required: false
    end
  end
end
