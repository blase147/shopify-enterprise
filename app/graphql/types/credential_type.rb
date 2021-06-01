module Types
  class CredentialType < Types::BaseObject
    field :private_key, String, null: true
    field :public_key, String, null: true
  end
end
