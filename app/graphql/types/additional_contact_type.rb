module Types
  class AdditionalContactType < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: true
    field :last_name, String, null: true
    field :email, String, null: true
    field :company_name, String, null: true
    field :phone, String, null: true
    field :__typename , String, null: true
    field :_destroy, GraphQL::Types::Boolean, null: false

  end
end
