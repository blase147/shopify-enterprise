module Types
  module Input
    class PasswordInputType < Types::BaseInputObject
      argument :password, String, required: true
      argument :password_confirmation, String, required: true
    end
  end
end
