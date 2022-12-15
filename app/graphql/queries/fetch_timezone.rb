module Queries
    class FetchTimezone < Queries::BaseQuery

      type Types::TimezoneType, null: false

      def resolve
        data = []
        ActiveSupport::TimeZone.all.map {|a| data.push({label: a.name, value: a.name}) }
        return {all_timezones: data, current_timezone: current_shop.setting.timezone}
      end
    end
end