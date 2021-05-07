module Mutations
  class UpdateCustomKeyword < Mutations::BaseMutation
    argument :params, Types::Input::CustomKeywordInputType, required: true
    field :custom_keyword, Types::CustomKeywordType, null: false

    def resolve(params:)
      keyword_params = Hash params
      begin
        custom_keyword = current_shop.custom_keywords.find_by(id: params[:id])
        custom_keyword.update!(keyword_params.except(:id))
        { custom_keyword: custom_keyword }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
