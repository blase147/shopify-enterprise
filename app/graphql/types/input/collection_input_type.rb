module Types
    module Input
      class CollectionInputType < Types::BaseInputObject
        argument :collection_id, String, required: true
        argument :collection_title, String, required: false
        argument :products, [Types::Input::ProductInputType], required: false
        argument :_destroy, GraphQL::Types::Boolean, required: false
        argument :__typename , String, required: false
      end
    end
  end