module Types
  class ReasonsCancelType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :return_content, String, null: true
    field :__typename, String, null: true
    field :_destroy, GraphQL::Types::Boolean, null: true
  end
end
