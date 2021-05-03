module Queries
  class FetchDashboardReport < Queries::BaseQuery
    type Types::DashboardReportType, null: false
    argument :duration, String, required: true

    def resolve(duration:)
      subscriptions = ReportService.new.all_subscriptions
      data_service = ReportDataService.new(subscriptions)
      range = data_service.get_date_range(duration)
      subscriptions_in_period = data_service.in_period_subscriptions(subscriptions, range)
      subcription_month_revenue = subscriptions_in_period.sum { |subscription| data_service.get_orders_total_amount(subscription) }
      active_subscriptions_count = data_service.get_subscriptions_count(subscriptions_in_period, 'ACTIVE')
      churn_rate = data_service.get_churn_rate(subscriptions, range)
      customer_lifetime = churn_rate.eql?(0) ? 0 : (data_service.get_customer_lifetime_value(subscriptions_in_period) / churn_rate).to_f.round(2)
      revenue_churn = data_service.month_graph_data(subscriptions, range, :revenue_churn_by_date)
      arr_data = data_service.year_graph_data(subscriptions, range, :arr_data_by_date)
      mrr_data = data_service.month_graph_data(subscriptions, range, :mrr_data_by_date)
      refund_data = data_service.month_graph_data(subscriptions, range, :refund_data_by_date)
      sales_data =  data_service.month_graph_data(subscriptions, range, :sales_data_by_date)
      active_customers = data_service.month_graph_data(subscriptions, range, :get_customers_by_date)
      renewal_data = data_service.month_graph_data(subscriptions, range, :renewal_data_by_date)
      { mrr: subcription_month_revenue, active_subscriptions_count: active_subscriptions_count,
        churn_rate: churn_rate, active_customers: active_customers, customer_lifetime_value: customer_lifetime.round(2),
        revenue_churn: revenue_churn, arr_data: arr_data, mrr_data: mrr_data, refund_data: refund_data, sales_data: sales_data, renewal_data: renewal_data }
    end
  end
end
