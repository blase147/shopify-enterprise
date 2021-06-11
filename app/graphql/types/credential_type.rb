module Types
  class CredentialType < Types::BaseObject
    field :private_key, String, null: true
    field :public_key, String, null: true
    field :twilio_account_sid, String, null: true
    field :twilio_auth_token, String, null: true
    field :twilio_phone_number, String, null: true
  end
end
