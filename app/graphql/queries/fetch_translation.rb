module Queries
  class FetchTranslation < Queries::BaseQuery
    type Types::TranslationType, null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      Translation.find_or_create_by(shop_id: current_shop.id)
    end
  end
end
