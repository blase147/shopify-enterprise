module Queries
  class FetchIntegrations < Queries::BaseQuery
    type [Types::IntegrationType], null: false
    argument :type, String, required: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.integrations.where(where_data(args))
    end

    def where_data(args)
      args[:type].present? ? "integration_type = #{Integration.integration_types[args[:type].to_sym]}" : ''
    end
  end
end
