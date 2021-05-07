module Types
  class CustomKeywordType < Types::BaseObject
    field :id, ID, null: false
    field :response, String, null: true
    field :keywords, [String], null: true
    field :status, String, null: true
    field :updated_at, String, null: true
  end
end
