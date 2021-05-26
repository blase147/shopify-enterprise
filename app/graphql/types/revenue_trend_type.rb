module Types
  class RevenueTrendType < Types::BaseObject
    field :total_sales, Types::GraphValueType, null: true
    field :recurring_sales, Types::GraphValueType, null: true
    field :mrr, Types::GraphValueType, null: true
    field :sales_per_charge, String, null: true
    field :refunds, Types::GraphValueType, null: true
    field :average_checkout_charge, Types::GraphValueType, null: true
    field :average_recurring_charge, Types::GraphValueType, null: true
    field :churn_rate, Types::GraphValueType, null: true
    field :new_customers, Types::GraphValueType, null: true
    field :active_customers, Types::GraphValueType, null: true
    field :new_subscriptions, Types::GraphValueType, null: true
    field :cancelled_subscriptions, Types::GraphValueType, null: true

    field :same_day_cancelled, String, null: true
    field :total_sales_data, [Types::GraphDataType], null: true
    field :refunds_data, [Types::GraphDataType], null: true
    field :active_customers_data, [Types::GraphDataType], null: true
    field :active_vs_churned_data, [Types::GraphDataType], null: true
    field :new_vs_cancelled_data, [Types::GraphDataType], null: true
    field :recurring_vs_checkout, [Types::GraphDataType], null: true
    field :estimated_seven_days, String, null: true
    field :estimated_thirty_days, String, null: true
    field :estimated_ninety_days, String, null: true
    field :historical_seven_days_revenue, String, null: true
    field :historical_thirty_days_revenue, String, null: true
    field :historical_ninety_days_revenue, String, null: true
    field :seven_days_error_revenue, String, null: true
    field :thirty_days_error_revenue, String, null: true
    field :ninety_days_error_revenue, String, null: true
    field :seven_days_upcoming_charge, String, null: true
    field :thirty_days_upcoming_charge, String, null: true
    field :ninety_days_upcoming_charge, String, null: true
    field :seven_days_error_charge, String, null: true
    field :thirty_days_error_charge, String, null: true
    field :ninety_days_error_charge, String, null: true
    field :sku_by_revenue, [Types::GraphValueType], null: true
    field :sku_by_subscriptions, [Types::GraphValueType], null: true
    field :sku_by_customers, [Types::GraphValueType], null: true
    field :billing_frequency_revenue, [Types::GraphValueType], null: true
    field :sku_by_frequency, [Types::GraphValueType], null: true
    field :__typename, String, null: true
  end
end
