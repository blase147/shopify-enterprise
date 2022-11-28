module Types
  class EmailNotificationType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :description, String, null: true
    field :from_name, String, null: true
    field :from_email, String, null: true
    field :email_subject, String, null: true
    field :email_message, String, null: true
    field :design_json, String, null: true
    field :status, GraphQL::Types::Boolean, null: true
    field :slug, String, null: true
    field :__typename , String, null: true

  end
end
