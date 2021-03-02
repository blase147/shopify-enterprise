module Types
  module Input
    class AdditionalContactInputType < Types::BaseInputObject
      argument :id, String,required: false
      argument :first_name, String, required: false
      argument :last_name, String, required: false
      argument :email, String,required: false
      argument :company_name, String, required: false
      argument :phone, String, required: false
      argument :__typename , String, required: false
      argument :_destroy, GraphQL::Types::Boolean, required: false

    end
  end
end