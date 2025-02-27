module Types
  class SmsAnalyticType < Types::BaseObject
    field :swap_count, Types::GraphValueType, null: true
    field :skip_count, Types::GraphValueType, null: true
    field :cancel_count, Types::GraphValueType, null: true
    field :delay_count, Types::GraphValueType, null: true
    field :one_time_revenue, Types::GraphValueType, null: true
    field :opt_out_messages, Types::GraphValueType, null: true
    field :messages, [Types::GraphDataType], null: true
    field :new_customers, Integer, null: true
    field :interected_customers, Integer, null: true
    field :opt_out_customers, Integer, null: true
    field :reached_customers, Integer, null: true
    field :most_swaped_product, Types::ProductType, null: true
    field :most_swaped_product_to, Types::ProductType, null: true
    field :most_skipped_product, Types::ProductType, null: true
    field :__typename, String, null: true
  end
end
