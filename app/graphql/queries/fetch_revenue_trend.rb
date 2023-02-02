module Queries
  class FetchRevenueTrend < Queries::BaseQuery
    type Types::RevenueTrendType, null: false
    argument :start_date, String, required: false
    argument :end_date, String, required: false

    def resolve(start_date:, end_date: )
      end_date = end_date.to_date
      start_date = start_date.to_date
      month = (end_date.year*12 + end_date.month) - (start_date.year*12 + start_date.month)
      analytics_data = current_shop.analytics_data.where(for_month: month).first rescue  current_shop.analytics_data.where(for_month: 1).first
      analytics_data = JSON.parse(analytics_data&.calculated_analytics_data)&.deep_symbolize_keys 
      # FetchRevenueTrendService.new.call(current_shop, start_date: s_date, end_date: e_date, refresh: refresh)
    end
  end
end
