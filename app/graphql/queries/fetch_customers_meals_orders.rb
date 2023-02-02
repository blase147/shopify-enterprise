module Queries
  class FetchCustomersMealsOrders < Queries::BaseQuery
    type Types::FetchCustomerMealType, null: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      {pre_order: WorldfarePreOrder.all, contracts: CustomerSubscriptionContract.all}
    end
  end
end