module Types
  module Input
    class RebuyMenuInputType < Types::BaseInputObject
      argument :id, ID,required: false
      argument :interval_type, String, required: false
      argument :interval_count, String, required: false
      argument :rebuy_type, String, required: false
      argument :status, String, required: false
      argument :product_images, [Types::Input::ProductInputType], required: false
      argument :collection_images, [Types::Input::CollectionInputType], required: false
    end
  end
end
