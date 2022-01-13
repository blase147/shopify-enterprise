module Types
  module Input
    class PasswordInputType < Types::BaseInputObject
      argument :enable_password, Boolean, required: true
      argument :password, String, required: false
      argument :password_confirmation, String, required: false
    end
  end
end
