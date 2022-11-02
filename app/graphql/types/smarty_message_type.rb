module Types
  class SmartyMessageType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :description, String, null: true
    field :body, String, null: true
    field :updated_at, String, null: true
    field :custom, String, null: true
    field :total_count, Integer, null: true
    field :created_at, Integer, null: true
    field :usage_count, Integer, null: true
    field :status, Boolean, null: true
  end
end
