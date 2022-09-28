module Queries
  class FetchCustomerInsights < Queries::BaseQuery
    type Types::CustomerInsightReportType, null: false
    argument :start_date, String, required: true
    argument :end_date, String, required: true

    def resolve(start_date:, end_date:)
      redis_subscriptions = $redis.get("subscriptions")
      if redis_subscriptions.nil?
        redis_subscriptions = ReportService.new.all_subscriptions.to_json
        temp=[]
        redis_subscriptions = JSON.parse(redis_subscriptions)
        redis_subscriptions.each do |s|
          temp << s.to_h.deep_transform_keys { |key| key.underscore }
        end
        $redis.set("subscriptions", temp.to_json)     
      end
      redis_subscriptions = JSON.parse(redis_subscriptions, object_class: OpenStruct)
      all_subscriptions = redis_subscriptions
      range = start_date.to_date..end_date.to_date
      all_subscription_report = CustomerInsightReportService.new(current_shop, all_subscriptions, range)
      subscriptions = all_subscription_report.in_period_subscriptions(all_subscriptions, range)
      previous_day_range = Time.current.beginning_of_year..Time.current - 24.hours
      current_day_range = Time.current.beginning_of_year..Time.current - 1.hour
      previous_day_subscriptions = all_subscription_report.in_period_hourly_subscriptions(all_subscriptions, previous_day_range)
      current_day_subscriptions = all_subscription_report.in_period_hourly_subscriptions(all_subscriptions, current_day_range)
      report = CustomerInsightReportService.new(current_shop, subscriptions, range)
      previous_day = CustomerInsightReportService.new(current_shop, previous_day_subscriptions, previous_day_range)
      current_day = CustomerInsightReportService.new(current_shop, current_day_subscriptions, current_day_range)
      swap_count = report.percentage(previous_day.swap_count, current_day.swap_count, report.swap_count)
      skip_count = report.percentage(previous_day.skip_count, current_day.skip_count, report.skip_count)
      restart_count = report.percentage(previous_day.restart_count, current_day.restart_count, report.restart_count)
      upsell_count = report.percentage(previous_day.upsell_count, current_day.upsell_count, report.upsell_count)
      skip_customers = report.active_vs_churned_skip_data
      swap_customers = report.active_vs_churned_swap_data
      restart_customers = report.active_vs_churned_restart_data
      upsell_customers = report.active_vs_churned_upsell_data
      sales_per_charge = report.percentage(previous_day.sales_per_charge, current_day.sales_per_charge, all_subscription_report.sales_per_charge)
      customers_count = report.percentage(previous_day.all_active_customers, current_day.all_active_customers, all_subscription_report.all_active_customers)
      charge_per_customer = report.percentage(previous_day.charge_per_customer, current_day.charge_per_customer, all_subscription_report.charge_per_customer)
      total_churn = report.percentage(previous_day.churn_rate, current_day.churn_rate, all_subscription_report.churn_rate)
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
      sku_by_customers = all_subscription_report.sku_by_customers
      billing_frequency = all_subscription_report.billing_frequency
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
