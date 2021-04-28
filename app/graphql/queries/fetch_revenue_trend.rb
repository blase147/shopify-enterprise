module Queries
  class FetchRevenueTrend < Queries::BaseQuery
    type Types::RevenueTrendType, null: false
    argument :granularity, String, required: true
    argument :data_period_for, String, required: true
    argument :data_by_period, String, required: true

    def resolve(granularity: , data_period_for: , data_by_period:)
      orders = ShopifyAPI::Order.find(:all)
      subscriptions = ReportService.new.get_subscriptions
      data_service = ReportDataService.new(subscriptions, orders)
      range = Date.today - data_period_for.to_i.send(data_by_period)..Date.today
      in_period_subscriptions = data_service.in_period_subscriptions(subscriptions, range)
      range_data_service = ReportDataService.new(in_period_subscriptions, orders, granularity, range)
      total_sales = data_service.get_total_sales
      recurring_sales = data_service.recurring_sales
      sales_per_charge = data_service.sales_per_charge
      total_refunds = range_data_service.total_refunds
      new_subscriptions = range_data_service.in_period_subscriptions(subscriptions, Date.today - 1.month..Date.today, 'ACTIVE').count
      cancelled_subscriptions = range_data_service.in_period_subscriptions(subscriptions, Date.today - 1.month..Date.today, 'CANCELLED').count
      average_checkout_charge = range_data_service.average_checkout_charge
      average_recurring_charge = range_data_service.average_recurring_charge
      new_customers = range_data_service.new_customers
      active_customers = range_data_service.get_subscriptions_count(in_period_subscriptions, 'ACTIVE')
      churn_rate = range_data_service.churn_rate(range)
      active_vs_churned_data = range_data_service.graph_data_by_granularity(:active_vs_churned_data)
      total_sales_data = range_data_service.graph_data_by_granularity(:total_sales_data)
      refunds_data = range_data_service.graph_data_by_granularity(:refunds_data)
      active_customers_data = range_data_service.graph_data_by_granularity(:active_customers_data)
      new_vs_cancelled_data = range_data_service.graph_data_by_granularity(:new_vs_cancelled_data)
      estimated_seven_days = data_service.get_upcoming_revenue(7)
      estimated_thirty_days = data_service.get_upcoming_revenue(30)
      estimated_ninety_days = data_service.get_upcoming_revenue(90)
      historical_seven_days_revenue = data_service.get_upcoming_historical_revenue(7)
      historical_thirty_days_revenue = data_service.get_upcoming_historical_revenue(30)
      historical_ninety_days_revenue = data_service.get_upcoming_historical_revenue(90)
      seven_days_error_revenue = data_service.get_upcoming_error_revenue(7)
      thirty_days_error_revenue = data_service.get_upcoming_error_revenue(30)
      ninety_days_error_revenue = data_service.get_upcoming_error_revenue(90)
      seven_days_upcoming_charge = data_service.get_upcoming_charge(7)
      thirty_days_upcoming_charge = data_service.get_upcoming_charge(30)
      ninety_days_upcoming_charge = data_service.get_upcoming_charge(90)
      upcoming_error_charges = data_service.get_upcoming_error_charges
      { total_sales: total_sales, recurring_sales: recurring_sales, sales_per_charge: sales_per_charge, refunds: total_refunds,
        new_subscriptions: new_subscriptions, cancelled_subscriptions: cancelled_subscriptions, average_checkout_charge: average_checkout_charge,
        average_recurring_charge: average_recurring_charge, new_customers: new_customers, active_customers: active_customers, churn_rate: churn_rate,
        active_vs_churned_data: active_vs_churned_data, total_sales_data: total_sales_data, refunds_data: refunds_data, active_customers_data: active_customers_data,
        new_vs_cancelled_data: new_vs_cancelled_data, estimated_seven_days: estimated_seven_days, estimated_thirty_days: estimated_thirty_days, estimated_ninety_days: estimated_ninety_days,
        historical_seven_days_revenue: historical_seven_days_revenue, historical_thirty_days_revenue: historical_thirty_days_revenue, historical_ninety_days_revenue: historical_ninety_days_revenue,
        seven_days_error_revenue: seven_days_error_revenue, thirty_days_error_revenue: thirty_days_error_revenue, ninety_days_error_revenue: ninety_days_error_revenue,
        seven_days_upcoming_charge: seven_days_upcoming_charge, thirty_days_upcoming_charge: thirty_days_upcoming_charge, ninety_days_upcoming_charge: ninety_days_upcoming_charge, upcoming_error_charges: upcoming_error_charges}
    end

    def get_upcoming_revenue(day_count)
      @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? get_orders_total_amount(subscription) : 0 }.to_f.round(2)
    end

    def get_upcoming_historical_revenue(day_count)
      @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? subscription.node.orders.edges.sum { |order| order.node.original_total_price_set.presentment_money.amount.to_f } : 0 }.to_f.round(2)
    end

    def get_upcoming_error_revenue(day_count)
      @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? subscription.node.orders.edges.sum { |order| calculated_error_revenue(order) } : 0}.to_f.round(2)
    end

    def calculated_error_revenue(order)
      order.node.transactions.sum{ |transaction| transaction.status == 'ERROR' ? transaction.amount_set.presentment_money.amount.to_f : 0 }
    end

    def get_upcoming_charge(day_count)
      @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? 1 : 0 }
    end

    def get_upcoming_error_charges
      @subscriptions.sum { |subscription|  subscription.node.orders.sum{ |order|  order.node.transactions.sum { |transaction| transaction.status == 'ERROR' ? 1 : 0 } } }
    end
  end
end
