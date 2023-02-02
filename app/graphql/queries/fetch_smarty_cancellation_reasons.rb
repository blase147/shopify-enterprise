module Queries
  class FetchSmartyCancellationReasons < Queries::BaseQuery
    type Types::CancellationReasonCollectionType, null: false
    argument :search_key, String, required: false
    argument :offset_attributes, Types::Input::OffsetAttributes, required: false
    argument :shop_domain, String, required: false

    def resolve(**args)
      current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
      offset_params = args[:offset_attributes].to_h
      cancellation_reasons = current_shop.smarty_cancellation_reasons.where(where_data(args)).order(created_at: :desc).limit(offset_params[:limit]).offset(offset_params[:offset])
      { cancellation_reasons: cancellation_reasons, total_count: current_shop.smarty_cancellation_reasons.where(where_data(args)).count}
    end

    def where_data(args)
      args[:search_key].present? ? "name ILIKE '%#{args[:search_key]}%'" : ''
    end
  end
end
