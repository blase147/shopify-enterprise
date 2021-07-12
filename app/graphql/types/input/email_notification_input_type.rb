module Types
    module Input
      class EmailNotificationInputType < Types::BaseInputObject
        argument :id, String, required: false
        argument :name, String, required: true
        argument :description, String, required: false
        argument :from_name, String, required: false
        argument :from_email, String, required: false
        argument :email_subject, String, required: false
        argument :email_message, String, required: false
        argument :status, GraphQL::Types::Boolean, required: false
        argument :slug, String, required: false
        argument :__typename, String, required: false
      end
    end
  end
