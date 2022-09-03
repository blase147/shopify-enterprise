class ComputeRevenueTrendService < ApplicationService
  def call(shop, start_date:, end_date:)
    orders_service = OrdersService.new(shop)
    subscriptions = ReportService.new.all_subscriptions
    range = start_date.to_date..end_date.to_date
    orders = orders_service.orders_in_range(range.first, range.last, 'id,refunds,created_at,total_price,current_total_price_set,total_shipping_price_set,source_name')
    data_service = ReportDataService.new(subscriptions, shop, orders, range)

    in_period_subscriptions = data_service.in_period_subscriptions(subscriptions, range)
    range_data_service = ReportDataService.new(in_period_subscriptions, shop, orders, range)

    today_range = Time.current.beginning_of_year..Time.current - 1.hour
    today_orders = orders_service.orders_in_range(today_range.first, today_range.last, 'id,refunds,created_at,total_price,current_total_price_set,total_shipping_price_set,source_name')
    today_subscriptions = data_service.in_period_hourly_subscriptions(subscriptions, today_range)
    today_range_data_service = ReportDataService.new(today_subscriptions, shop, today_orders, today_range)

    yesterday_range = Time.current.beginning_of_year..Time.current - 24.hours
    yesterday_orders = orders_service.orders_in_range(yesterday_range.first, yesterday_range.last, 'id,refunds,created_at,total_price,current_total_price_set,total_shipping_price_set,source_name')
    yesterday_subscriptions = data_service.in_period_hourly_subscriptions(subscriptions, yesterday_range)
    yesterday_range_data_service = ReportDataService.new(yesterday_subscriptions, shop, yesterday_orders, yesterday_range)

    last_month_range = (Date.today - 1.day) - 1.month..Date.today - 1.day
    #last_month_subscriptions = data_service.subscriptions_by_order_period(subscriptions, last_month_range)

    total_sales = data_service.calculate_percentage(yesterday_range_data_service.get_total_sales, today_range_data_service.get_total_sales, data_service.get_total_sales)
    recurring_sales = data_service.calculate_percentage(yesterday_range_data_service.recurring_sales, today_range_data_service.recurring_sales, data_service.recurring_sales)
    mrr = data_service.calculate_percentage(yesterday_range_data_service.mrr(yesterday_subscriptions, yesterday_range), today_range_data_service.mrr(today_subscriptions, today_range), data_service.mrr(subscriptions, last_month_range))
    sales_per_charge = data_service.calculate_percentage(yesterday_range_data_service.sales_per_charge, today_range_data_service.sales_per_charge, range_data_service.sales_per_charge)
    total_refunds = data_service.calculate_percentage(yesterday_range_data_service.refunded_amount(yesterday_orders), today_range_data_service.refunded_amount(today_orders), range_data_service.refunded_amount(orders))
    new_subscriptions = data_service.calculate_percentage(yesterday_range_data_service.in_period_subscriptions(yesterday_subscriptions, yesterday_range, 'ACTIVE').count, today_range_data_service.in_period_subscriptions(today_subscriptions, today_range, 'ACTIVE').count, range_data_service.in_period_subscriptions(subscriptions, range, 'ACTIVE').count)
    cancelled_subscriptions = data_service.calculate_percentage(yesterday_range_data_service.cancelled_subscriptions_in_period(yesterday_range), today_range_data_service.cancelled_subscriptions_in_period(today_range), range_data_service.cancelled_subscriptions_in_period(range))
    average_checkout_charge = data_service.calculate_percentage(yesterday_range_data_service.average_checkout_charge, today_range_data_service.average_checkout_charge, data_service.average_checkout_charge)
    average_recurring_charge = data_service.calculate_percentage(yesterday_range_data_service.average_recurring_charge, today_range_data_service.average_recurring_charge, data_service.average_recurring_charge)
    new_customers = data_service.calculate_percentage(yesterday_range_data_service.new_customers, today_range_data_service.new_customers, range_data_service.new_customers)
    active_customers = data_service.calculate_percentage(yesterday_range_data_service.all_active_customers, today_range_data_service.all_active_customers, data_service.all_active_customers)
    churn_rate = data_service.calculate_percentage(yesterday_range_data_service.get_churn_rate(yesterday_subscriptions, yesterday_range), today_range_data_service.get_churn_rate(today_subscriptions, today_range), range_data_service.get_churn_rate(subscriptions, range))
    same_day_cancelled = data_service.calculate_percentage(yesterday_range_data_service.same_day_cancelled, today_range_data_service.same_day_cancelled, range_data_service.same_day_cancelled)

    active_vs_churned_data = data_service.graph_data_by_granularity(:active_vs_churned_data)
    total_sales_data = data_service.graph_data_by_granularity(:total_sales_data)
    refunds_data = range_data_service.graph_data_by_granularity(:refunds_data)
    active_customers_data = data_service.graph_data_by_granularity(:active_customers_data)
    new_vs_cancelled_data = range_data_service.graph_data_by_granularity(:new_vs_cancelled_data)
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
    sku_by_revenue = data_service.sku_by_revenue
    sku_by_subscriptions = data_service.sku_by_subscriptions
    sku_by_customers = data_service.sku_by_customers
    billing_frequency_revenue = data_service.billing_frequency_revenue
    sku_by_frequency = data_service.sku_by_frequency
    { total_sales: total_sales, recurring_sales: recurring_sales, mrr: mrr, sales_per_charge: sales_per_charge, refunds: total_refunds,
      new_subscriptions: new_subscriptions, cancelled_subscriptions: cancelled_subscriptions, average_checkout_charge: average_checkout_charge,
      average_recurring_charge: average_recurring_charge, new_customers: new_customers, active_customers: active_customers, churn_rate: churn_rate,
      active_vs_churned_data: active_vs_churned_data, total_sales_data: total_sales_data, refunds_data: refunds_data, 
      active_customers_data: active_customers_data,new_vs_cancelled_data: new_vs_cancelled_data, estimated_seven_days: estimated_seven_days, 
      estimated_thirty_days: estimated_thirty_days, estimated_ninety_days: estimated_ninety_days, historical_seven_days_revenue: historical_seven_days_revenue, 
      historical_thirty_days_revenue: historical_thirty_days_revenue, historical_ninety_days_revenue: historical_ninety_days_revenue,
      seven_days_error_revenue: seven_days_error_revenue, thirty_days_error_revenue: thirty_days_error_revenue, 
      ninety_days_error_revenue: ninety_days_error_revenue, seven_days_upcoming_charge: seven_days_upcoming_charge, thirty_days_upcoming_charge: thirty_days_upcoming_charge, 
      ninety_days_upcoming_charge: ninety_days_upcoming_charge, seven_days_error_charge: seven_days_error_charge, thirty_days_error_charge: thirty_days_error_charge, 
      ninety_days_error_charge: ninety_days_error_charge, recurring_vs_checkout: recurring_vs_checkout, same_day_cancelled: same_day_cancelled, 
      sku_by_subscriptions: sku_by_subscriptions, sku_by_revenue: sku_by_revenue, billing_frequency_revenue: billing_frequency_revenue, 
      sku_by_customers: sku_by_customers, sku_by_frequency: sku_by_frequency }
  end
end
