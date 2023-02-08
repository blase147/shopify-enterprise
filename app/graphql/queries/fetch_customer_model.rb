module Queries
  class FetchCustomerModel < Queries::BaseQuery

    type Types::CustomerModalPageType, null: false
    argument :page, String, required: false

    def resolve(**args)
      customer_subscriptions = current_shop.customer_modals.all.page(args[:page])
      {customer_subscriptions: customer_subscriptions, total_count: customer_subscriptions.count, total_pages: customer_subscriptions.total_pages, page_number: args[:page]}
    end
  end
end
