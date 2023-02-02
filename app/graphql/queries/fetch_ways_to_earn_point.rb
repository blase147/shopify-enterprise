module Queries
    class FetchWaysToEarnPoint < Queries::BaseQuery
  
      type Types::WaysToEarnPointWithTitleType, null: true
      argument :shop_domain, String, required: false
  
      def resolve(**args)
        current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
        {ways_to_earn: current_shop.ways_to_earn_points&.order(created_at: :desc), all_titles: WaysToEarnPoint.titles.to_json}
      end
    end
  end