module Queries
  class FetchCustomerInsights < Queries::BaseQuery
    type Types::CustomerInsightReportType, null: false

    def resolve
      all_subscriptions = ReportService.new.all_subscriptions
      range = Date.today - 30.days..Date.today
      all_subscription_report = CustomerInsightReportService.new(current_shop, subscriptions, range)
      subscriptions = all_subscription_report.in_period_subscriptions(all_subscriptions, range)
      previous_day_subscriptions = all_subscription_report.in_period_subscriptions(all_subscriptions, Date.today - 1.day..Date.today - 1.day)
      current_day_subscriptions = all_subscription_report.in_period_subscriptions(all_subscriptions, Date.today..Date.today)
      report = CustomerInsightReportService.new(current_shop, subscriptions, range)
      previous_day = CustomerInsightReportService.new(current_shop, previous_day_subscriptions, Date.today - 1.day..Date.today - 1.day)
      current_day = CustomerInsightReportService.new(current_shop, current_day_subscriptions, Date.today..Date.today)
      swap_count = report.percentage(previous_day.swap_count, current_day.swap_count, report.swap_count)
      skip_count = report.percentage(previous_day.skip_count, current_day.skip_count, report.skip_count)
      restart_count = report.percentage(previous_day.restart_count, current_day.restart_count, report.restart_count)
      skip_customers = report.month_graph_data(:active_vs_churned_skip_data)
      swap_customers = report.month_graph_data(:active_vs_churned_swap_data)
      sales_per_charge = report.percentage(previous_day.sales_per_charge, current_day.sales_per_charge, report.sales_per_charge)
      customers_count = report.percentage(previous_day.sub_customers_count, current_day.sub_customers_count, report.sub_customers_count)
      charge_per_customer = report.percentage(previous_day.charge_per_customer, current_day.charge_per_customer, report.charge_per_customer)
      total_churn = report.percentage(previous_day.churn_rate, current_day.churn_rate, report.churn_rate)
      { customers_count: customers_count, sales_per_charge: sales_per_charge, charge_per_customer: charge_per_customer,
        total_churn: total_churn, swap_count: swap_count, skip_count: skip_count,
        restart_count: restart_count, skip_customers: skip_customers, swap_customers: swap_customers }
    end
  end
end
