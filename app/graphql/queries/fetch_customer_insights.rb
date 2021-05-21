module Queries
  class FetchCustomerInsights < Queries::BaseQuery
    type Types::CustomerInsightReportType, null: false

    def resolve
      subscriptions = ReportService.new.all_subscriptions
      range = Date.today - 1.year..Date.today
      report = CustomerInsightReportService.new(current_shop, subscriptions, range)
      previous_day = CustomerInsightReportService.new(current_shop, subscriptions, Date.today - 1.day..Date.today - 1.day)
      current_day = CustomerInsightReportService.new(current_shop, subscriptions, Date.today..Date.today)
      swap_count = report.percentage(previous_day.swap_count, current_day.swap_count, report.swap_count)
      skip_count = report.percentage(previous_day.skip_count, current_day.skip_count, report.skip_count)
      restart_count = report.percentage(previous_day.restart_count, current_day.restart_count, report.restart_count)
      skip_customers = report.month_graph_data(:active_vs_churned_skip_data)
      swap_customers = report.month_graph_data(:active_vs_churned_swap_data)
      { swap_count: swap_count, skip_count: skip_count, restart_count: restart_count, skip_customers: skip_customers,
        swap_customers: swap_customers }
    end
  end
end
