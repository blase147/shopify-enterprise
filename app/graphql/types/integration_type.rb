module Types
  class IntegrationType < Types::BaseObject
    field :id, ID, null: true
    field :name, String, null: true
    field :integration_type, String, null: true
    field :service_type, String, null: true
    field :default, String, null: true
    field :image_url, String, null: true
    field :credentials, String, null: true
    field :status, String, null: true
    field :keys, String, null: true
    field :__typename, String, null: true
  end
end
