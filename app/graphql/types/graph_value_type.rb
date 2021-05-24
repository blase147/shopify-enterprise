module Types
  class GraphValueType < Types::BaseObject
    field :value, String, null: true
    field :charge_count, String, null: true
    field :active_customers, String, null: true
    field :churned_customers, String, null: true
    field :refunds_count, String, null: true
    field :new_subscriptions_count, String, null: true
    field :cancelled_subscriptions_count, String, null: true
    field :recurring_sales, String, null: true
    field :one_time_sales, String, null: true
    field :up, GraphQL::Types::Boolean, null: true
    field :percent, Integer, null: true
    field :sku, String, null: true
    field :billing_policy, String, null: true
    field :__typename, String, null: true
  end
end
