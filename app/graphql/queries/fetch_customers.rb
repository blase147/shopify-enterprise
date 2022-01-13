module Queries
  class FetchCustomers < Queries::BaseQuery

    type [Types::CustomerSubscriptionType], null: false
    argument :status, String, required: false
    argument :sort_column, String, required: false
    argument :sort_direction, String, required: false

    def resolve(**args)
      #current_shop.sync_contracts
      current_shop.customer_subscription_contracts.includes(:shop, :additional_contacts, :billing_address).where(where_data(args[:status] || 'all')).order(order_by(args))
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

    def order_by(params)
      params[:sort_column].present? && params[:sort_direction].present? ? "#{params[:sort_column]} #{params[:sort_direction]}" : 'shopify_at DESC'
    end
  end
end
