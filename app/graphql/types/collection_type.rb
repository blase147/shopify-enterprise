module Types
    class CollectionType < Types::BaseObject
      field :collection_id, ID, null: false
      field :collection_title, String, null: true
      field :products, [Types::ProductType], null: true
      field :_destroy, GraphQL::Types::Boolean, null: true

      field :__typename , String, null: true
    end
  end
  