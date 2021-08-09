module Types
  module Input
    class ShipEngineOrderInputType < Types::BaseInputObject
      argument :id, String, required: true

      argument :ship_to, Types::Input::AddressInputType, required: false
      argument :due_date, String, required: false
      argument :signature_confirmation, GraphQL::Types::Boolean, required: false
      argument :signature_insurance, GraphQL::Types::Boolean, required: false
      argument :create_return_label, GraphQL::Types::Boolean, required: false
      argument :contains_alcohol, GraphQL::Types::Boolean, required: false
      argument :status, String, required: false
      argument :order_items, [Types::Input::OrderItemInputType], required: false
      argument :customer, Types::Input::CustomerInputType, required: false
      argument :__typename, String, required: false
    end
  end
end
