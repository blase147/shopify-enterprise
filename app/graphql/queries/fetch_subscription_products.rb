module Queries
    class FetchSubscriptionProducts < Queries::BaseQuery
  
      type Types::SubscriptionProductPageType, null: true
      argument :page, String, required: false
      def resolve **args
        subscription_products = current_shop.subscription_products.order(created_at: :desc).page(args[:page])
        {subscription_products: subscription_products, total_count: subscription_products.count, total_pages: subscription_products.total_pages, page_number: args[:page]}
      end
    end
end