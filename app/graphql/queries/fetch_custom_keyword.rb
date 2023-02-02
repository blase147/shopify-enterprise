module Queries
  class FetchCustomKeyword < Queries::BaseQuery
    argument :id, String, required: true
    type Types::CustomKeywordType, null: false

    def resolve(id:)
      current_shop.custom_keywords.find(id)
    end
  end
end
