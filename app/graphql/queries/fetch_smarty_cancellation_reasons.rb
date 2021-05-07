module Queries
  class FetchSmartyCancellationReasons < Queries::BaseQuery
    type [Types::SmartyCancellationReasonType], null: false
    argument :search_key, String, required: false

    def resolve(**args)
      current_shop.smarty_cancellation_reasons.all.where(args[:search_key].present? ? "name ILIKE '%#{args[:search_key]}%'" : '')
    end
  end
end
