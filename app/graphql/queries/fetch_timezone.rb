module Queries
    class FetchTimezone < Queries::BaseQuery

      type Types::TimezoneType, null: false
      argument :shop_domain, String, required: false

      def resolve(**args)
        current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
        data = []
        ActiveSupport::TimeZone.all.map {|a| data.push({label: a.name, value: a.name}) }
        return {all_timezones: data, current_timezone: current_shop.setting.timezone}
      end
    end
end