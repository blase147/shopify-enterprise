module Queries
  class FetchCustomKeywords < Queries::BaseQuery
    type [Types::CustomKeywordType], null: false
    argument :search_key, String, required: false

    def resolve(**args)
      current_shop.custom_keywords.all.where(args[:search_key].present? ? "ARRAY[keywords] @> ARRAY['#{args[:search_key]}']" : '')
    end
  end
end
