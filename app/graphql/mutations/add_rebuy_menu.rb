module Mutations
  class AddRebuyMenu < Mutations::BaseMutation
    argument :params, Types::Input::RebuyMenuInputType, required: true
    field :rebuy_menu, Types::RebuyMenuType, null: true

    def resolve(params:)
      rebuy_menu_params = Hash params
      begin
        rebuy_menu = current_shop.rebuy_menus.create!(rebuy_menu_params)

        CreateRebuyForAllCustomersWorker.perform_async(current_shop.id, rebuy_menu.id)
        
        { rebuy_menu: rebuy_menu }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
