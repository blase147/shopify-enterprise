module Types
  class CancellationReasonCollectionType < Types::BaseObject
    field :total_count, Integer, null: true
    field :cancellation_reasons, [Types::SmartyCancellationReasonType], null: true
  end
end
