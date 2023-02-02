module Queries
  class FetchDashboardReport < Queries::BaseQuery
    type Types::DashboardReportType, null: false
    argument :start_date, String, required: true
    argument :end_date, String, required: true
    argument :shop_domain, String, required: false

    def resolve(start_date:, end_date:, shop_domain:)
      current_shop = Shop.find_by_shopify_domain(shop_domain) rescue current_shop

      subscriptions = BulkOperationResponse.find_by(shop_id: current_shop.id, response_type: "subscriptions")&.api_raw_data
      subscriptions = JSON.parse(subscriptions, object_class: OpenStruct)
      range = start_date.to_date..end_date.to_date
      all_orders =  BulkOperationResponse.find_by(shop_id: current_shop.id, response_type: "all_orders")&.api_raw_data
      all_orders = JSON.parse(all_orders, object_class: OpenStruct)
      orders = all_orders.select {|order|  ((start_date.to_date)..end_date.to_date).include?(order.created_at.to_date)}

      data_service = ReportDataService.new(subscriptions, current_shop, orders, range)
      #current_year_range = Time.current.beginning_of_year.to_date..Date.today
      last_hour_range = Time.current.beginning_of_year..Time.current - 1.hour
      last_24_hours_range = Time.current.beginning_of_year..Time.current - 24.hours
      last_month_range = (Date.today - 1.day) - 1.month..Date.today - 1.day
      #last_month_subscriptions = data_service.subscriptions_by_order_period(subscriptions, last_month_range)
      past_hour_subscriptions = data_service.in_period_hourly_subscriptions(subscriptions, last_hour_range)
      past_subscriptions = data_service.in_period_hourly_subscriptions(subscriptions, last_24_hours_range)
      past_month_subscriptions = data_service.in_period_subscriptions(subscriptions, last_month_range)
      subcription_month_revenue = data_service.calculate_percentage(data_service.mrr(past_subscriptions, last_24_hours_range), data_service.mrr(past_hour_subscriptions, last_hour_range), data_service.mrr(subscriptions, last_month_range))
      active_subscriptions_count = data_service.calculate_percentage(data_service.get_subscriptions_count(past_subscriptions, 'ACTIVE'),
                                  data_service.get_subscriptions_count(past_hour_subscriptions, 'ACTIVE'), data_service.get_subscriptions_count(subscriptions, 'ACTIVE'))
      past_churn_rate = data_service.get_churn_rate(past_subscriptions, last_24_hours_range)
      last_hour_churn_rate = data_service.get_churn_rate(past_hour_subscriptions, last_hour_range)
      past_month_churn_rate = data_service.get_churn_rate(subscriptions, last_month_range)
      churn_rate = data_service.calculate_percentage(past_churn_rate, last_hour_churn_rate, past_month_churn_rate)
      customer_lifetime = past_month_churn_rate.eql?(0) ? {value: 0, percent: 0, up: false} : data_service.calculate_percentage((data_service.get_customer_lifetime_value(past_month_subscriptions) / past_churn_rate),
                          (data_service.get_customer_lifetime_value(past_hour_subscriptions) / last_hour_churn_rate),
                          (data_service.get_customer_lifetime_value(past_month_subscriptions) / past_month_churn_rate))
      revenue_churn = data_service.graph_data_by_granularity(:revenue_churn_by_date)
      arr_data = data_service.year_graph_data(subscriptions, range, :arr_data_by_date)
      mrr_data = data_service.graph_data_by_granularity(:mrr_data_by_date)
      refund_data = data_service.graph_data_by_granularity(:refund_data_by_date)
      sales_data =  data_service.graph_data_by_granularity(:sales_data_by_date)
      active_customers = data_service.graph_data_by_granularity(:get_customers_by_date)
      renewal_data = data_service.graph_data_by_granularity(:renewal_data_by_date)
      { mrr: subcription_month_revenue, active_subscriptions_count: active_subscriptions_count,
        churn_rate: churn_rate, active_customers: active_customers, customer_lifetime_value: customer_lifetime,
        revenue_churn: revenue_churn, arr_data: arr_data, mrr_data: mrr_data, refund_data: refund_data, sales_data: sales_data, renewal_data: renewal_data }
    end
  end
end
