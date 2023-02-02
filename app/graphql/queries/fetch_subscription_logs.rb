module Queries
  class FetchSubscriptionLogs < Queries::BaseQuery
    type Types::LogType, null: false
    argument :page, String, required: false

    def resolve(page)
      subscription_logs = current_shop.subscription_logs.order(created_at: :desc).page page[:page]
      {subscription_logs: subscription_logs, total_count: current_shop.subscription_logs.count, total_pages: subscription_logs.total_pages, page_number: page[:page]}
    end
  end
end
