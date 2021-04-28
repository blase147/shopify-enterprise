module Types
  class GraphValueType < Types::BaseObject
    field :value, String, null: true
    field :active_customers, String, null: true
    field :churned_customers, String, null: true
    field :refunds_count, String, null: true
    field :new_subscriptions_count, String, null: true
    field :cancelled_subscriptions_count, String, null: true
    field :__typename, String, null: true
  end
end
