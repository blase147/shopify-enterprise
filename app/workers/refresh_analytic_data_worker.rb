class RefreshAnalyticDataWorker
    include Sidekiq::Worker
    def perform
        end_date= Date.today
        Shop.all&.each do |shop|
            shop.connect
            #for one month
            start_date = Date.today - 1.month
            revenue_trend_one = ComputeRevenueTrendService.new.call(shop, start_date: start_date, end_date: end_date)&.to_json rescue nil
            AnalyticsDatum.find_or_initialize_by(shop_id: shop.id, for_month: 1)&.update(calculated_analytics_data: revenue_trend_one) if revenue_trend_one.present?
           
            #for 3 month
            start_date = Date.today - 3.month
            revenue_trend_three = ComputeRevenueTrendService.new.call(shop, start_date: start_date, end_date: end_date)&.to_json
            AnalyticsDatum.find_or_initialize_by(shop_id: shop.id, for_month: 3)&.update(calculated_analytics_data: revenue_trend_three) if revenue_trend_three.present?

            #for 6 month
            start_date = Date.today - 6.month
            revenue_trend_six = ComputeRevenueTrendService.new.call(shop, start_date: start_date, end_date: end_date)&.to_json rescue nil
            AnalyticsDatum.find_or_initialize_by(shop_id: shop.id, for_month: 6)&.update(calculated_analytics_data: revenue_trend_six) if revenue_trend_six.present?

            #for 12 month
            start_date = Date.today - 12.month
            revenue_trend_twelve = ComputeRevenueTrendService.new.call(shop, start_date: start_date, end_date: end_date)&.to_json
            AnalyticsDatum.find_or_initialize_by(shop_id: shop.id, for_month: 12)&.update(calculated_analytics_data: revenue_trend_twelve) if revenue_trend_twelve.present?
        end

    end

end