module Types
  module Input
    class CredentialsInputType < Types::BaseInputObject
      argument :private_key, String, required: false
      argument :public_key, String, required: false

      argument :__typename, String, required: false
    end
  end
end
