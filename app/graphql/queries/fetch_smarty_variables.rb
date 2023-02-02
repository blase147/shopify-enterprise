module Queries
  class FetchSmartyVariables < Queries::BaseQuery
    type [Types::SmartyVariableType], null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.smarty_variables.order(created_at: :desc)
    end
  end
end
