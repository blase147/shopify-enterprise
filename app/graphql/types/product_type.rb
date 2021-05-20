module Types
    class ProductType < Types::BaseObject
      field :id, ID, null: false
      field :product_id, String, null: true
      field :image, String, null: true
      field :title, String, null: true
      field :_destroy, GraphQL::Types::Boolean, null: true

      field :__typename , String, null: true
    end
  end
  