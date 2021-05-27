module Types
  class PasswordType < Types::BaseObject
    field :id, ID, null: false
    field :password, String, null: false
    field :password_confirmation, String, null: false
  end
end
