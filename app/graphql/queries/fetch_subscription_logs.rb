module Queries
  class FetchSubscriptionLogs < Queries::BaseQuery
    type Types::LogType, null: false

    def resolve
      subscription_logs = SubscriptionLog.order(created_at: :desc).limit 50
      {subscription_logs: subscription_logs}
    end
  end
end
