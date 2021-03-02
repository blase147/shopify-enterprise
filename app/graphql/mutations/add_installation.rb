module Mutations
  class AddInstallation < Mutations::BaseMutation
    argument :params, Types::Input::InstallationInputType, required: true
    field :theme, String, null: false

    def resolve(params:)
      theme_id = params[:theme]
      widget = params[:widget]

      begin
        SnippetsService.new(theme_id).send(widget)
        raise result[:error] if result.has_key?(:error)
      rescue Exception => ex
        GraphQL::ExecutionError.new(ex.message)
      end
    end
  end
end