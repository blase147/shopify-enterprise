class FetchRevenueTrendService < ApplicationService
  include Redisable

  def call(shop, start_date:, end_date:, refresh: false)
    data_key = analytics_key(shop, start_date, end_date)
    data = redis.get(data_key)
    return JSON.parse(data) if data && refresh == false

    revenue_trend = ComputeRevenueTrendService.new.call(shop, start_date: start_date, end_date: end_date)

    revenue_trend
  end

  def analytics_key(shop, s_date, e_date)
    "#{shop.id}:#{s_date}:#{e_date}"
  end
end
