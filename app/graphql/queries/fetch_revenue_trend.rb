module Queries
  class FetchRevenueTrend < Queries::BaseQuery
    type Types::RevenueTrendType, null: false
    argument :start_date, String, required: true
    argument :end_date, String, required: true

    def resolve(start_date:, end_date:)
      orders_service = OrdersService.new(current_shop)
      subscriptions = ReportService.new.all_subscriptions
      data_service = ReportDataService.new(subscriptions)
      range = start_date.to_date..end_date.to_date
      orders = orders_service.orders_in_range(range.first, range.last, 'id,refunds,created_at,current_total_price_set,total_shipping_price_set,source_name')
      in_period_subscriptions = data_service.in_period_subscriptions(subscriptions, range)
      range_data_service = ReportDataService.new(in_period_subscriptions, orders, range)
      total_sales = range_data_service.get_total_sales.to_f.round(2)
      recurring_sales = range_data_service.recurring_sales
      mrr = range_data_service.mrr(in_period_subscriptions)
      sales_per_charge = range_data_service.sales_per_charge
      total_refunds = range_data_service.refunded_amount(orders)
      new_subscriptions = range_data_service.in_period_subscriptions(subscriptions, range, 'ACTIVE').count
      cancelled_subscriptions = range_data_service.in_period_subscriptions(subscriptions, range, 'CANCELLED').count
      average_checkout_charge = range_data_service.average_checkout_charge.to_f.round(2)
      average_recurring_charge = range_data_service.average_recurring_charge.to_f.round(2)
      new_customers = range_data_service.new_customers
      active_customers = range_data_service.customers_in_range(range)
      churn_rate = range_data_service.get_churn_rate(subscriptions, range)
      active_vs_churned_data = range_data_service.graph_data_by_granularity(:active_vs_churned_data)
      total_sales_data = range_data_service.graph_data_by_granularity(:total_sales_data)
      refunds_data = range_data_service.graph_data_by_granularity(:refunds_data)
      active_customers_data = range_data_service.graph_data_by_granularity(:active_customers_data)
      new_vs_cancelled_data = range_data_service.graph_data_by_granularity(:new_vs_cancelled_data)
      same_day_cancelled = range_data_service.same_day_cancelled
      estimated_seven_days = data_service.get_upcoming_revenue(7)
      estimated_thirty_days = data_service.get_upcoming_revenue(30)
      estimated_ninety_days = (data_service.get_upcoming_revenue(30) * 3).to_f.round(2)
      historical_seven_days_revenue = data_service.get_upcoming_historical_revenue(7)
      historical_thirty_days_revenue = data_service.get_upcoming_historical_revenue(30)
      historical_ninety_days_revenue = (data_service.get_upcoming_historical_revenue(30) * 3).to_f.round(2)
      recurring_vs_checkout = range_data_service.graph_data_by_granularity(:recurring_vs_checkout_data)
      seven_days_error_revenue = data_service.get_upcoming_error_revenue(7)
      thirty_days_error_revenue = data_service.get_upcoming_error_revenue(30)
      ninety_days_error_revenue = (data_service.get_upcoming_error_revenue(30) * 3).to_f.round(2)
      seven_days_upcoming_charge = data_service.get_upcoming_charge(7)
      thirty_days_upcoming_charge = data_service.get_upcoming_charge(30)
      ninety_days_upcoming_charge = (data_service.get_upcoming_charge(30) * 3).to_f.round(2)
      seven_days_error_charge = data_service.get_upcoming_error_charges(7)
      thirty_days_error_charge = data_service.get_upcoming_error_charges(30)
      ninety_days_error_charge = (data_service.get_upcoming_error_charges(30) * 3).to_f.round(2)
      sku_by_revenue = range_data_service.sku_by_revenue
      sku_by_subscriptions = range_data_service.sku_by_subscriptions
      sku_by_customers = range_data_service.sku_by_customers
      billing_frequency_revenue = range_data_service.billing_frequency_revenue
      { total_sales: total_sales, recurring_sales: recurring_sales, mrr: mrr, sales_per_charge: sales_per_charge, refunds: total_refunds,
        new_subscriptions: new_subscriptions, cancelled_subscriptions: cancelled_subscriptions, average_checkout_charge: average_checkout_charge,
        average_recurring_charge: average_recurring_charge, new_customers: new_customers, active_customers: active_customers, churn_rate: churn_rate,
        active_vs_churned_data: active_vs_churned_data, total_sales_data: total_sales_data, refunds_data: refunds_data, active_customers_data: active_customers_data,
        new_vs_cancelled_data: new_vs_cancelled_data, estimated_seven_days: estimated_seven_days, estimated_thirty_days: estimated_thirty_days, estimated_ninety_days: estimated_ninety_days,
        historical_seven_days_revenue: historical_seven_days_revenue, historical_thirty_days_revenue: historical_thirty_days_revenue, historical_ninety_days_revenue: historical_ninety_days_revenue,
        seven_days_error_revenue: seven_days_error_revenue, thirty_days_error_revenue: thirty_days_error_revenue, ninety_days_error_revenue: ninety_days_error_revenue,
        seven_days_upcoming_charge: seven_days_upcoming_charge, thirty_days_upcoming_charge: thirty_days_upcoming_charge, ninety_days_upcoming_charge: ninety_days_upcoming_charge,
        seven_days_error_charge: seven_days_error_charge, thirty_days_error_charge: thirty_days_error_charge, ninety_days_error_charge: ninety_days_error_charge, recurring_vs_checkout: recurring_vs_checkout,
        same_day_cancelled: same_day_cancelled, sku_by_subscriptions: sku_by_subscriptions, sku_by_revenue: sku_by_revenue,
        billing_frequency_revenue: billing_frequency_revenue, sku_by_customers: sku_by_customers }
    end
  end
end
