module Queries
  class FetchWeeklyMenus < Queries::BaseQuery
    type [Types::WeeklyMenuType], null: false

    def resolve
      current_shop.weekly_menus.order(created_at: :desc)
    end
  end
end
