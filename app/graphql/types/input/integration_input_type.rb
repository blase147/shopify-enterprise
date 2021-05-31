module Types
  module Input
    class IntegrationInputType < Types::BaseInputObject
      argument :id, ID, required: false
      argument :name, String, required: false
      argument :integration_type, String, required: false
      argument :service_type, String, required: false
      argument :default, String, required: false
      argument :credentials, Types::Input::CredentialsInputType, required: false
      argument :status, String, required: false
      argument :keys, String, required: false

      argument :__typename, String, required: false
    end
  end
end
