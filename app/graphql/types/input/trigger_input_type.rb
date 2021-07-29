module Types
  module Input
    class TriggerInputType < Types::BaseInputObject
      argument :id, String, required: false

      argument :name, String, required: true

      argument :__typename, String, required: false
      argument :_destroy, GraphQL::Types::Boolean, required: false
    end
  end
end
