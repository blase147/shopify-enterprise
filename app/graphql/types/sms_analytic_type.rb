module Types
  class DashboardReportType < Types::BaseObject
    field :swap_count, Types::GraphValueType, null: true
    field :skip_count, Types::GraphValueType, null: true
    field :delay_count, Types::GraphValueType, null: true
    field :one_time_revenue, Types::GraphValueType, null: true
    field :total_sms, Integer, null: true
    field :inbound_sms, Integer, null: true
    field :outbound_sms, Integer, null: true
    field :new_customers, Integer, null: true
    field :interected_customers, Integer, null: true
    field :opt_out_customers, Integer, null: true
    field :reached_customers, Integer, null: true
    field :most_swaped_product, Type::ProductType, null: true
    field :most_swaped_product_to, Type::ProductType, null: true
    field :most_skipped_product, Type::ProductType, null: true
    field :__typename, String, null: true
  end
end
