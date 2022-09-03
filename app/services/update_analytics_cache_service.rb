class UpdateAnalyticsCacheService < ApplicationService
   def current_shop
    return @current_shop if @current_shop.present?

    @current_shop = Shop.find_by(shopify_domain: params[:shop])
  end
  
  def call(shop)
    start_date, end_date = default_date

    ComputeRevenueTrendService.new.call(current_shop, start_date: start_date, end_date: end_date)
  end

  def default_date
    return Date.today - 32.days, Date.today - 1.day
  end
end
