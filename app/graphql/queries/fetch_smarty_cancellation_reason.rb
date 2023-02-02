module Queries
  class FetchSmartyCancellationReason < Queries::BaseQuery
    argument :id, String, required: true
    type Types::SmartyCancellationReasonType, null: false

    def resolve(id:)
      current_shop.smarty_cancellation_reasons.find(id)
    end
  end
end
