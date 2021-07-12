module Types
  class LogType < Types::BaseObject
    field :subscription_logs, [Types::SubscriptionLogType], null: true
    field :total_count, String, null: true
    field :total_pages, String, null: true
    field :page_number, String, null: true
  end
end
