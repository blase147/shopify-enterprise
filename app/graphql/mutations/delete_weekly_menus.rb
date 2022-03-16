module Mutations
  class DeleteWeeklyMenus < Mutations::BaseMutation
    argument :params, [String], required: true
    field :weekly_menus, [Type::WeeklyMenuType], null: false

    def resolve(params:)
      menu_params = params

      begin
         WeeklyMenu.destroy(menu_params)
         weekly_menus = current_shop.weekly_menus.order(created_at: :desc)
         { menus: weekly_menus }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
