module Queries
  class FetchRevenueTrend < Queries::BaseQuery
    type Types::RevenueTrendType, null: false
    argument :start_date, String, required: true
    argument :end_date, String, required: true
    argument :refresh, Boolean, required: true

    def resolve(start_date:, end_date:, refresh: )
      s_date = start_date&.to_date&.strftime("%Y-%m-%d")
      e_date = end_date&.to_date&.strftime("%Y-%m-%d")
      FetchRevenueTrendService.new.call(current_shop, start_date: s_date, end_date: e_date, refresh: refresh)
    end
  end
end
