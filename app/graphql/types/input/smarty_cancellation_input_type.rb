module Types
  module Input
    class SmartyCancellationInputType < Types::BaseInputObject
      argument :id, String, required: false
      argument :name, String, required: false
      argument :winback, String, required: false
      argument :__typename, String, required: false
    end
  end
end
