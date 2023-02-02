module Queries
  class FetchCustomerModel < Queries::BaseQuery

    type Types::CustomerModalPageType, null: false
    argument :page, String, required: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      customer_subscriptions = CustomerModal.all.page(args[:page])
      {customer_subscriptions: customer_subscriptions, total_count: customer_subscriptions.count, total_pages: customer_subscriptions.total_pages, page_number: args[:page]}
    end
  end
end
