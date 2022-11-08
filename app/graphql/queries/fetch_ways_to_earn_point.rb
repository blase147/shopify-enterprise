module Queries
    class FetchWaysToEarnPoint < Queries::BaseQuery
  
      type [Types::FetchWaysToEarnPointType], null: false
  
      def resolve
        current_shop.ways_to_earn_points&.order(created_at: :desc)
      end
    end
  end