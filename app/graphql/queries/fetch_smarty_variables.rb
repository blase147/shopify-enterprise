module Queries
  class FetchSmartyVariables < Queries::BaseQuery
    type [Types::SmartyVariableType], null: false
    argument :offset_attributes, Types::Input::OffsetAttributes, required: true

    def resolve
      current_shop.smarty_variables.order(created_at: :desc)
    end
  end
end
