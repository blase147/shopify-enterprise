module Mutations
  class UpdateIntegration < Mutations::BaseMutation
    argument :params, Types::Input::IntegrationInputType, required: true
    field :integration, Types::IntegrationType, null: false

    def resolve(params:)
      integration_params = Hash params
      begin
        integration = current_shop.integrations.find_by(id: params[:id])
        integration.update!(integration_params.except(:id))
        { integration: integration }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
