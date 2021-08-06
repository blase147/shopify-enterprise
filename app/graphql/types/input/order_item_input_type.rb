module Types
  module Input
    class OrderItemInputType < Types::BaseInputObject
      argument :grams, String, required: false
      argument :length, String, required: false
      argument :width, String, required: false
      argument :height, String, required: false
    end
  end
end
