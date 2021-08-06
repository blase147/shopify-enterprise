module Types
  class CustomerType < Types::BaseObject
    field :first_name, String, null: true
    field :last_name, String, null: true
    field :name, String, null: true
    field :email, String, null: true
    field :phone, String, null: true
  end
end
