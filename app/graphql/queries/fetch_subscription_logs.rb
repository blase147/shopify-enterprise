module Queries
  class FetchSubscriptionLogs < Queries::BaseQuery
    type Types::LogType, null: false

    def resolve
      subscription_logs = current_shop.subscription_logs.order(created_at: :desc).limit 50
      {subscription_logs: subscription_logs}
    end
  end
end
