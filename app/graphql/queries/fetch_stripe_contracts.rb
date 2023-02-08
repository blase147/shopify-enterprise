module Queries
  class FetchStripeContracts < Queries::BaseQuery

    type Types::StripeContractPageType, null: false
    
    argument :page, String, required: false

    def resolve(**args)
      stripe_contracts = current_shop.stripe_contracts.page(args[:page]).order(created_at: :desc)
      {stripe_contracts: stripe_contracts, total_count: stripe_contracts.count, total_pages: stripe_contracts.total_pages, page_number: args[:page]}
    end
  end
end
