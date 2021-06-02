module Queries
  class FetchDashboardReport < Queries::BaseQuery
    type Types::DashboardReportType, null: false
    argument :start_date, String, required: true
    argument :end_date, String, required: true

    def resolve(start_date:, end_date:)
      subscriptions = ReportService.new.all_subscriptions
      range = start_date.to_date..end_date.to_date
      orders_service = OrdersService.new(current_shop)
      orders = orders_service.orders_in_range(range.first, range.last, 'id,refunds,created_at')
      data_service = ReportDataService.new(subscriptions, orders)
      current_year_range = Time.current.beginning_of_year.to_date..Date.today
      last_hour_range = Time.current.beginning_of_year..Time.current - 1.hour
      last_24_hours_range = Time.current.beginning_of_year..Time.current - 24.hours
      last_month_range = Date.today - 30.days..Date.today - 1.day
      last_month_subscriptions = data_service.subscriptions_by_order_period(subscriptions, last_month_range)
      past_hour_subscriptions = data_service.in_period_hourly_subscriptions(subscriptions, last_hour_range)
      past_subscriptions = data_service.in_period_hourly_subscriptions(subscriptions, last_24_hours_range)
      current_year_subscriptions = data_service.in_period_subscriptions(subscriptions, current_year_range)
      subcription_month_revenue = data_service.calculate_percentage(data_service.mrr(past_subscriptions, last_24_hours_range), data_service.mrr(past_hour_subscriptions, last_hour_range), data_service.mrr(last_month_subscriptions, range))
      active_subscriptions_count = data_service.calculate_percentage(data_service.get_subscriptions_count(past_subscriptions, 'ACTIVE'),
                                  data_service.get_subscriptions_count(past_hour_subscriptions, 'ACTIVE'), data_service.get_subscriptions_count(current_year_subscriptions, 'ACTIVE'))
      past_churn_rate = data_service.get_churn_rate(past_subscriptions, last_24_hours_range)
      last_hour_churn_rate = data_service.get_churn_rate(past_hour_subscriptions, last_hour_range)
      current_year_churn_rate = data_service.get_churn_rate(current_year_subscriptions, current_year_range)
      churn_rate = data_service.calculate_percentage(past_churn_rate, last_hour_churn_rate, current_year_churn_rate)
      customer_lifetime = current_year_churn_rate.eql?(0) ? {value: 0, percent: 0, up: false} : data_service.calculate_percentage((data_service.get_customer_lifetime_value(current_year_subscriptions) / past_churn_rate),
                          (data_service.get_customer_lifetime_value(past_hour_subscriptions) / last_hour_churn_rate),
                          (data_service.get_customer_lifetime_value(current_year_subscriptions) / current_year_churn_rate))
      revenue_churn = data_service.month_graph_data(subscriptions, range, :revenue_churn_by_date)
      arr_data = data_service.year_graph_data(subscriptions, range, :arr_data_by_date)
      mrr_data = data_service.month_graph_data(subscriptions, range, :mrr_data_by_date)
      refund_data = data_service.month_graph_data(subscriptions, range, :refund_data_by_date)
      sales_data =  data_service.month_graph_data(subscriptions, range, :sales_data_by_date)
      active_customers = data_service.month_graph_data(subscriptions, range, :get_customers_by_date)
      renewal_data = data_service.month_graph_data(subscriptions, range, :renewal_data_by_date)
      { mrr: subcription_month_revenue, active_subscriptions_count: active_subscriptions_count,
        churn_rate: churn_rate, active_customers: active_customers, customer_lifetime_value: customer_lifetime,
        revenue_churn: revenue_churn, arr_data: arr_data, mrr_data: mrr_data, refund_data: refund_data, sales_data: sales_data, renewal_data: renewal_data }
    end
  end
end
