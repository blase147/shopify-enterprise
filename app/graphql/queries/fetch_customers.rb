module Queries
  class FetchCustomers < Queries::BaseQuery

    type [Types::CustomerSubscriptionType], null: false
    argument :status, String, required: false

    def resolve(**args)
      current_shop.sync_contracts
      current_shop.customers.where(where_data(args[:status] || 'all')).order(shopify_at: :desc)
    end

    def where_data(status)
      case status
      when 'all' then ''
      when 'new'
        "shopify_at::date = '#{Date.today}'"
      when 'returning'
        "status='PAUSED'"
      when 'active'
        "status='ACTIVE'"
      when 'expired'
        "status='CANCELLED'"
      end
    end
  end
end
