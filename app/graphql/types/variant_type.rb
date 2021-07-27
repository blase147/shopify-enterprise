module Types
  class VariantType < Types::BaseObject
    field :id, ID, null: false
    field :variant_id, String, null: true
    field :image, String, null: true
    field :title, String, null: true
    field :_destroy, GraphQL::Types::Boolean, null: true

    field :__typename, String, null: true
  end
end
