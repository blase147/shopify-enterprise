module Queries
  class FetchSmartyCancellationReason < Queries::BaseQuery
    argument :id, String, required: true
    type Types::SmartyCancellationReasonType, null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      current_shop.smarty_cancellation_reasons.find(args[:id])
    end
  end
end