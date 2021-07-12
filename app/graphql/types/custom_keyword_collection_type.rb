module Types
  class CustomKeywordCollectionType < Types::BaseObject
    field :total_count, Integer, null: true
    field :custom_keywords, [Types::CustomKeywordType], null: true
  end
end
