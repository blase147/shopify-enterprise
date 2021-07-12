module Queries
  class FetchIntegration < Queries::BaseQuery
    argument :id, String, required: true
    type Types::IntegrationType, null: false

    def resolve(id:)
      current_shop.integrations.find(id)
    end
  end
end
