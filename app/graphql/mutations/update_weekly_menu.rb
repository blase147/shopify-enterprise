module Mutations
  class UpdateWeeklyMenu < Mutations::BaseMutation
    argument :params, Types::Input::WeeklyMenuInputType, required: true
    field :menu, Types::WeeklyMenuType, null: false

    def resolve(params:)
      menu_params = Hash params
      id = params[:id]

      begin
        menu = current_shop.weekly_menus.find_by(id: params[:id])
        menu.update!(menu_params)

        { menu: menu }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
