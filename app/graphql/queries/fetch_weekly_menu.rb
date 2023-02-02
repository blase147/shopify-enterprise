module Queries
  class FetchWeeklyMenu < Queries::BaseQuery
    type Types::WeeklyMenuType, null: false
    argument :id, ID, required: true

    def resolve(id:)
      current_shop.weekly_menus.find(id)
    end
  end
end
