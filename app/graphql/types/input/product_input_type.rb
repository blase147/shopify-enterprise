module Types
    module Input
      class ProductInputType < Types::BaseInputObject
        argument :product_id, String, required: true
        argument :image, String, required: false
        argument :_destroy, GraphQL::Types::Boolean, required: false
        argument :title, String, required: false

        argument :__typename , String, required: false
      end
    end
  end