module Types
  module Input
    class OrderItemInputType < Types::BaseInputObject
      argument :weight, String, required: false
      argument :weight_unit, String, required: false
      argument :length, String, required: false
      argument :width, String, required: false
      argument :height, String, required: false
      argument :dimension_unit, String, required: false
      argument :signature_confirmation, String, required: false
      argument :signature_insurance, GraphQL::Types::Boolean, required: false
      argument :create_return_label, GraphQL::Types::Boolean, required: false
      argument :contains_alcohol, GraphQL::Types::Boolean, required: false
    end
  end
end
