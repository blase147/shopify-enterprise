module Queries
  class FetchIntegrations < Queries::BaseQuery
    type [Types::IntegrationType], null: false
    argument :type, String, required: false

    def resolve(**args)
      current_shop.integrations.where(where_data(args))
    end

    def where_data(args)
      args[:type].present? ? "integration_type = #{Integration.integration_types[args[:type].to_sym]}" : ''
    end
  end
end
