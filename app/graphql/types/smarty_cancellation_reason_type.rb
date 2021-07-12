module Types
  class SmartyCancellationReasonType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :winback, String, null: true
    field :updated_at, String, null: true
  end
end
