module Types
    class CustomerModalPageType  < Types::BaseObject
        field :customer_subscriptions, [Types::CustomerModalType], null: true
        field :total_count, String, null: true
        field :total_pages, String, null: true
        field :page_number, String, null: true
    end
end