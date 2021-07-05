module Mutations
  class AddInstallation < Mutations::BaseMutation
    argument :params, Types::Input::InstallationInputType, required: true
    field :theme, String, null: false

    def resolve(params:)
      theme_id = params[:theme]
      widget = params[:widget]

      begin
        if params[:widget] == 'add_to_order_status'
          ScriptTagsService.new(current_shop).add
        else
          SnippetsService.new(theme_id).send(widget)
        end
        raise result[:error] if result.has_key?(:error)
      rescue Exception => ex
        GraphQL::ExecutionError.new(ex.message)
      end
    end
  end
end
