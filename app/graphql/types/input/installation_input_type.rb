module Types
  module Input
    class InstallationInputType < Types::BaseInputObject
      argument :theme, String, required: true
      argument :widget, String, required: true

      argument :__typename, String, required: false
    end
  end
end