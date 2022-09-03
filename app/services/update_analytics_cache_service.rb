class UpdateAnalyticsCacheService < ApplicationService
   
 current_shop = Shop.find_by(shopify_domain: params[:shop])  
  
  def call(shop)
    start_date, end_date = default_date

    ComputeRevenueTrendService.new.call(current_shop, start_date: start_date, end_date: end_date)
  end

  def default_date
    return Date.today - 32.days, Date.today - 1.day
  end
end
