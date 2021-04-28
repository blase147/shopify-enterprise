module Types
  class RevenueTrendType < Types::BaseObject
    field :total_sales, String, null: true
    field :recurring_sales, String, null: true
    field :sales_per_charge, String, null: true
    field :refunds, String, null: true
    field :average_checkout_charge, String, null: true
    field :average_recurring_charge, String, null: true
    field :churn_rate, String, null: true
    field :new_customers, String, null: true
    field :active_customers, String, null: true
    field :new_subscriptions, String, null: true
    field :cancelled_subscriptions, String, null: true
    field :same_day_cancelled, String, null: true
    field :total_sales_data, [Types::GraphDataType], null: true
    field :refunds_data, [Types::GraphDataType], null: true
    field :active_customers_data, [Types::GraphDataType], null: true
    field :active_vs_churned_data, [Types::GraphDataType], null: true
    field :new_vs_cancelled_data, [Types::GraphDataType], null: true
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
    field :upcoming_error_charges, String, null: true

    field :__typename, String, null: true
  end
end
