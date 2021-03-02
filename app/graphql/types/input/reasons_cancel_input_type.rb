module Types
    module Input
      class ReasonsCancelInputType < Types::BaseInputObject
        argument :id, String, required: false
        argument :title, String, required: true
        argument :return_content, String, required: false
        argument :__typename, String, required: false
        argument :_destroy, GraphQL::Types::Boolean, required: false
      end
    end
  end