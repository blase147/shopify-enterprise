module Types
  class PasswordType < Types::BaseObject
    field :id, ID, null: false
    field :password, String, null: true
    field :success, String, null: true
  end
end
