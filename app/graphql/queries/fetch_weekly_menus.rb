module Queries
  class FetchWeeklyMenus < Queries::BaseQuery
    type [Types::WeeklyMenuType], null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.weekly_menus.order(created_at: :desc)
    end
  end
end