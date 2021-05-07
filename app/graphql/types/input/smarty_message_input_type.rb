module Types
  module Input
    class SmartyMessageInputType < Types::BaseInputObject
      argument :id, String, required: true
      argument :title, String, required: false
      argument :description, String, required: false
      argument :body, String, required: false
      argument :__typename, String, required: false
    end
  end
end
