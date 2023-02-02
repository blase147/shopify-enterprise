module Queries
  class FetchCustomKeywords < Queries::BaseQuery
    type Types::CustomKeywordCollectionType, null: false
    argument :search_key, String, required: false
    argument :offset_attributes, Types::Input::OffsetAttributes, required: false

    def resolve(**args)
      offset_params = args[:offset_attributes].to_h
      custom_keywords = current_shop.custom_keywords.all.where(where_data(args)).limit(offset_params[:limit]).offset(offset_params[:offset])
      { custom_keywords: custom_keywords, total_count: current_shop.custom_keywords.where(where_data(args)).count }
    end

    def where_data(args)
      args[:search_key].present? ? "ARRAY[keywords] @> ARRAY['#{args[:search_key]}']" : ''
    end
  end
end
