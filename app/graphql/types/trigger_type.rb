module Types
  class TriggerType < Types::BaseObject
    field :name, String, null: false

    field :__typename, String, null: true
    field :_destroy, GraphQL::Types::Boolean, null: false
  end
end
