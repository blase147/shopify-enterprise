module Queries
  class FetchCustomers < Queries::BaseQuery

    type Types::CustomerSubscriptionPageType, null: false
    argument :status, String, required: false
    argument :sort_column, String, required: false
    argument :sort_direction, String, required: false
    argument :page, String, required: false
    argument :searchquery, String, required: false

    def resolve(**args)
      if args[:searchquery].present?
        customer_subscriptions = current_shop.customer_subscription_contracts.where(where_data(args[:status] || 'all')).search(args[:searchquery]).page(args[:page]).includes(:shop, :additional_contacts, :billing_address).order(order_by(args))
      else
        customer_subscriptions = current_shop.customer_subscription_contracts.includes(:shop, :additional_contacts, :billing_address).where(where_data(args[:status] || 'all')).page(args[:page]).order(order_by(args))
      end
      {customer_subscriptions: customer_subscriptions, total_count: customer_subscriptions.count, total_pages: customer_subscriptions.total_pages, page_number: args[:page]}
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
