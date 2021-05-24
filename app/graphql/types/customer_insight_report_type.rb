module Types
  class CustomerInsightReportType < Types::BaseObject
    field :customers_count, Types::GraphValueType, null: true
    field :sales_per_charge, Types::GraphValueType, null: true
    field :charge_per_customer, Types::GraphValueType, null: true
    field :total_churn, Types::GraphValueType, null: true
    field :swap_count, Types::GraphValueType, null: true
    field :skip_count, Types::GraphValueType, null: true
    field :restart_count, Types::GraphValueType, null: true
    field :upsell_count, Types::GraphValueType, null: true
    field :dunning_count, Types::GraphValueType, null: true
    field :recovered, Types::GraphValueType, null: true
    field :churned, Types::GraphValueType, null: true
    field :dunned, Types::GraphValueType, null: true
    field :dunning_data, [Types::GraphDataType], null: true
    field :dunning_recovered_data, [Types::GraphDataType], null: true
    field :dunning_churn_data, [Types::GraphDataType], null: true
    field :active_customers_percentage, String, null: true
    field :dunned_customers_percentage, String, null: true
    field :cancelled_customers_percentage, String, null: true
    field :skip_customers, [Types::GraphDataType], null: true
    field :swap_customers, [Types::GraphDataType], null: true
    field :swap_customers, [Types::GraphDataType], null: true
    field :restart_customers, [Types::GraphDataType], null: true
    field :upsell_customers, [Types::GraphDataType], null: true
    field :sku_by_customers, [Types::GraphValueType], null: true
    field :billing_frequency, [Types::GraphValueType], null: true

    field :__typename, String, null: true
  end
end
