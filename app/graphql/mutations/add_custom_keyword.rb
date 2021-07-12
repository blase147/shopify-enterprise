module Mutations
  class AddCustomKeyword < Mutations::BaseMutation
    argument :params, Types::Input::CustomKeywordInputType, required: true
    field :custom_keyword, Types::CustomKeywordType, null: false

    def resolve(params:)
      keyword_params = Hash params
      begin
        custom_keyword = current_shop.custom_keywords.create!(keyword_params)
        { custom_keyword: custom_keyword }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
