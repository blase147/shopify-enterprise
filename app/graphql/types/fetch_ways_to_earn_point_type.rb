module Types
    class FetchWaysToEarnPointType < Types::BaseObject
      field :title, String, null: true
      field :id, ID, null: true
      field :points_awarded, String, null: true
      field :status, Boolean, null: true
      field :summary, String, null: true
    end
  end
  