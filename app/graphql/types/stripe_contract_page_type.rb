module Types
    class StripeContractPageType  < Types::BaseObject
        field :stripe_contracts, [Types::StripeContractType], null: true
        field :total_count, String, null: true
        field :total_pages, String, null: true
        field :page_number, String, null: true
    end
end