module Queries
  class FetchSmsSetting < Queries::BaseQuery
    type Types::SmsSettingType, null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      SmsSetting.find_or_create_by(shop_id: current_shop.id)
    end
  end
end