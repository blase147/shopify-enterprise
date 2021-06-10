module Types
  class LogType < Types::BaseObject
    field :subscription_logs, [Types::SubscriptionLogType], null: true
  end
end
