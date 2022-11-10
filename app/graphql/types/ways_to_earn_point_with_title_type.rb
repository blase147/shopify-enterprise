module Types
    class WaysToEarnPointWithTitleType < Types::BaseObject
        field :ways_to_earn, [Types::WaysToEarnPointType], null: true
        field :all_titles, String, null: true
    end
end
  