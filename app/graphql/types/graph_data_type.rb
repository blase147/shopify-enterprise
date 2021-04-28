module Types
  class GraphDataType < Types::BaseObject
    field :date, String, null: true
    field :data, Types::GraphValueType, null: true
    field :__typename, String, null: true
  end
end
