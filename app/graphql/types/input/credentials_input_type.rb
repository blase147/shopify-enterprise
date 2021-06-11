module Types
  module Input
    class CredentialsInputType < Types::BaseInputObject
      argument :private_key, String, required: false
      argument :public_key, String, required: false
      argument :user_name, String, required: false
      argument :password, String, required: false
      argument :twilio_account_sid, String, required: false
      argument :twilio_auth_token, String, required: false
      argument :twilio_phone_number, String, required: false

      argument :__typename, String, required: false
    end
  end
end
