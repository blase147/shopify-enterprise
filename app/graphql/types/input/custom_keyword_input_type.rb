module Types
  module Input
    class CustomKeywordInputType < Types::BaseInputObject
      argument :id, String, required: false
      argument :response, String, required: true
      argument :keywords, [String], required: true
      argument :status, String, required: false
      argument :__typename, String, required: false
    end
  end
end
