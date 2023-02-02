module Mutations
  class AddBundleMenu < Mutations::BaseMutation
    argument :params, Types::Input::BundleMenuInputType, required: true
    field :menu, Types::BundleMenuType, null: false

    def resolve(params:)
      menu_params = Hash params

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
