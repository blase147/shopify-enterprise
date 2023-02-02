module Queries
  class FetchCustomKeyword < Queries::BaseQuery
    type Types::CustomKeywordType, null: false

    argument :id, String, required: true

    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.custom_keywords.find(args[:id])
    end
  end
end