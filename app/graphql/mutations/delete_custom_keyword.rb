module Mutations
  class DeleteCustomKeyword < Mutations::BaseMutation
    argument :id, String, required: true
    field :custom_keyword, Types::CustomKeywordType, null: false

    def resolve(id:)
      begin
        custom_keyword = current_shop.custom_keywords.find_by(id: id)
        custom_keyword.destroy
        { custom_keyword: custom_keyword }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
