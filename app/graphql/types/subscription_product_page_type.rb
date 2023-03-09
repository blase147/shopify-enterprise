module Types
  class SubscriptionProductPageType < Types::BaseObject
    field :subscription_products, [Types::SubscriptionProductType], null: true
    field :total_count, String, null: true
    field :total_pages, String, null: true
    field :page_number, String, null: true
  end
end
