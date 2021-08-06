module Types
  module Input
    class CustomerInputType < Types::BaseInputObject
      argument :name, String, required: false
      argument :email, String, required: false
      argument :phone, String, required: false
    end
  end
end
