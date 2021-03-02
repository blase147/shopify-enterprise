module Types
  module Input
    class CustomerSubscriptionInputType < Types::BaseInputObject
      argument :id, String, required: false
      argument :first_name, String, required: false
      argument :last_name, String, required: false
      argument :email, String, required: false
      argument :communication, String, required: false
      argument :language, String, required: false
      argument :subscription, String, required: false
      argument :status, String, required: false
      argument :created_at, String, required: false
      argument :updated_at, String, required: false
      argument :auto_collection, GraphQL::Types::Boolean, required: false
      argument :phone, String, required: false
      argument :additional_contacts, [Types::Input::AdditionalContactInputType], required: false
      argument :billing_address, Types::Input::BillingAddressInputType, required: false
      argument :__typename , String, required: false
    end
  end
end