module Queries
  class FetchCustomerInsights < Queries::BaseQuery
    type Types::CustomerInsightReportType, null: false
    argument :start_date, String, required: true
    argument :end_date, String, required: true

    def resolve(start_date:, end_date:)
      all_subscriptions = ReportService.new.all_subscriptions
      range = start_date.to_date..end_date.to_date
      all_subscription_report = CustomerInsightReportService.new(current_shop, all_subscriptions, range)
      subscriptions = all_subscription_report.in_period_subscriptions(all_subscriptions, range)
      previous_day_subscriptions = all_subscription_report.in_period_subscriptions(all_subscriptions, Date.today - 1.day..Date.today - 1.day)
      current_day_subscriptions = all_subscription_report.in_period_subscriptions(all_subscriptions, Date.today..Date.today)
      report = CustomerInsightReportService.new(current_shop, subscriptions, range)
      previous_day = CustomerInsightReportService.new(current_shop, previous_day_subscriptions, Date.today - 1.day..Date.today - 1.day)
      current_day = CustomerInsightReportService.new(current_shop, current_day_subscriptions, Date.today..Date.today)
      swap_count = report.percentage(previous_day.swap_count, current_day.swap_count, report.swap_count)
      skip_count = report.percentage(previous_day.skip_count, current_day.skip_count, report.skip_count)
      restart_count = report.percentage(previous_day.restart_count, current_day.restart_count, report.restart_count)
      upsell_count = report.percentage(previous_day.upsell_count, current_day.upsell_count, report.upsell_count)
      skip_customers = report.graph_data_by_granularity(:active_vs_churned_skip_data)
      swap_customers = report.graph_data_by_granularity(:active_vs_churned_swap_data)
      restart_customers = report.graph_data_by_granularity(:active_vs_churned_restart_data)
      upsell_customers = report.graph_data_by_granularity(:active_vs_churned_upsell_data)
      sales_per_charge = report.percentage(previous_day.sales_per_charge, current_day.sales_per_charge, report.sales_per_charge)
      customers_count = report.percentage(previous_day.sub_customers_count, current_day.sub_customers_count, report.sub_customers_count)
      charge_per_customer = report.percentage(previous_day.charge_per_customer, current_day.charge_per_customer, report.charge_per_customer)
      total_churn = report.percentage(previous_day.churn_rate, current_day.churn_rate, report.churn_rate)
      dunning_count = report.percentage(previous_day.dunning_count, current_day.dunning_count, report.dunning_count)
      dunned = report.percentage(previous_day.dunned, current_day.dunned, report.dunned)
      recovered = report.percentage(previous_day.recovered_count, current_day.recovered_count, report.recovered_count)
      churned = report.percentage(previous_day.churned_count, current_day.churned_count, report.churned_count)
      dunning_data = report.graph_data_by_granularity(:dunning_data)
      dunning_recovered_data = report.graph_data_by_granularity(:dunning_recovered_data)
      dunning_churn_data = report.graph_data_by_granularity(:dunning_churn_data)
      active_customers_percentage = report.customers_percentage('ACTIVE').round(2)
      dunned_customers_percentage = report.dunning_customers_percentage.round(2)
      cancelled_customers_percentage = report.customers_percentage('CANCELLED').round(2)
      sku_by_customers = report.sku_by_customers
      billing_frequency = report.billing_frequency
      cancellation_reasons = report.cancellation_reasons
      { customers_count: customers_count, sales_per_charge: sales_per_charge, charge_per_customer: charge_per_customer,
        total_churn: total_churn, swap_count: swap_count, skip_count: skip_count,
        restart_count: restart_count, upsell_count: upsell_count, skip_customers: skip_customers,
        swap_customers: swap_customers, dunning_count: dunning_count, recovered: recovered, churned: churned,
        dunned: dunned, upsell_customers: upsell_customers, restart_customers: restart_customers,
        active_customers_percentage: active_customers_percentage, dunned_customers_percentage: dunned_customers_percentage,
        cancelled_customers_percentage: cancelled_customers_percentage, dunning_data: dunning_data,
        sku_by_customers: sku_by_customers, dunning_recovered_data: dunning_recovered_data, dunning_churn_data: dunning_churn_data,
        billing_frequency: billing_frequency, cancellation_reasons: cancellation_reasons }
    end
  end
end
