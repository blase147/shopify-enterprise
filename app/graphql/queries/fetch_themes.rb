module Queries
  class FetchThemes < Queries::BaseQuery

    type [Types::ThemeType], null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      ShopifyAPI::Theme.all
    end
  end
end