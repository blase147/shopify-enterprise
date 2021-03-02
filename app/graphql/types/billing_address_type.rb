module Types
  class BillingAddressType < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: true
    field :last_name, String, null: true
    field :email, String, null: false
    field :company, String, null: true
    field :phone, String, null: true
    field :address_1, String, null: true
    field :address_2, String, null: true
    field :city, String, null: true
    field :zip_code, String, null: true
    field :language, String, null: true

    field :__typename , String, null: true
    field :_destroy, GraphQL::Types::Boolean, null: false
  end
end
