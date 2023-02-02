module Queries
  class FetchSmartyMessage < Queries::BaseQuery
    argument :id, String, required: true
    argument :shop_domain, String, required: false
    type Types::SmartyMessageType, null: false

    def  resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.smarty_messages.find_by(id: args[:id])
    end
  end
end