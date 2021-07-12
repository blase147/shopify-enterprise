module Types
  class DashboardReportType < Types::BaseObject
    field :mrr, Types::GraphValueType, null: true
    field :active_subscriptions_count, Types::GraphValueType, null: true
    field :churn_rate, Types::GraphValueType, null: true
    field :customer_lifetime_value, Types::GraphValueType, null: true
    field :active_customers, [Types::GraphDataType], null: true
    field :revenue_churn, [Types::GraphDataType], null: true
    field :arr_data, [Types::GraphDataType], null: true
    field :mrr_data, [Types::GraphDataType], null: true
    field :refund_data, [Types::GraphDataType], null: true
    field :sales_data, [Types::GraphDataType], null: true
    field :renewal_data, [Types::GraphDataType], null: true

    field :__typename, String, null: true
  end
end
