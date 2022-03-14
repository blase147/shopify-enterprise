module Mutations
  class AddWeeklyMenu < Mutations::BaseMutation
    argument :params, Types::Input::WeeklyMenuInputType, required: true
    field :menu, Types::WeeklyMenuType, null: false

    def resolve(params:)
      menu_params = Hash params
      menu_params[:weekly_menu_attributes] = menu_params.delete(:weekly_menu)
      begin
        menu = current_shop.weekly_menus.create!(menu_params)
        { menu: menu }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
