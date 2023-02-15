module Mutations
  class AddBundleMenu < Mutations::BaseMutation
    argument :params, Types::Input::BundleMenuInputType, required: true
    field :bundle_menu, Types::BundleMenuType, null: false

    def resolve(params:)
      bundle_menu_params = Hash params
      begin
        bundle_menu = current_shop.bundle_menus.create!(bundle_menu_params)
        { bundle_menu: bundle_menu }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
