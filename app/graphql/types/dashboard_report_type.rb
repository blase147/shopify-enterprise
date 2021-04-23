module Types
  class DashboardReportType < Types::BaseObject
    field :mrr, String, null: true
    field :active_subscriptions_count, String, null: true
    field :churn_rate, String, null: true
    field :active_customers, [Types::GraphDataType], null: true
    field :customer_lifetime_value, String, null: true
    field :revenue_churn, [Types::GraphDataType], null: true
    field :arr_data, [Types::GraphDataType], null: true
    field :mrr_data, [Types::GraphDataType], null: true
    field :refund_data, [Types::GraphDataType], null: true
    field :sales_data, [Types::GraphDataType], null: true

    field :__typename, String, null: true
  end
end
