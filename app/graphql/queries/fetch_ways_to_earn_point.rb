module Queries
    class FetchWaysToEarnPoint < Queries::BaseQuery
  
      type Types::WaysToEarnPointWithTitleType, null: true
  
      def resolve
        {ways_to_earn: current_shop.ways_to_earn_points&.order(created_at: :desc), all_titles: WaysToEarnPoint.titles.to_json}
      end
    end
  end