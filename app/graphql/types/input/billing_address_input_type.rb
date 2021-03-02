module Types
  module Input
    class BillingAddressInputType < Types::BaseInputObject
      argument :id, String, required: false
      argument :first_name, String, required: false
      argument :last_name, String, required: false
      argument :email, String, required: false
      argument :company, String, required: false
      argument :phone, String, required: false
      argument :address_1, String, required: false
      argument :address_2, String, required: false
      argument :city, String, required: false
      argument :zip_code, String, required: false
      argument :language, String, required: false

      argument :__typename , String, required: false
      argument :_destroy, GraphQL::Types::Boolean, required: false
    end
  end
end