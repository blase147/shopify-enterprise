module Types
  class GraphDataType < Types::BaseObject
    field :date, String, null: true
    field :data, String, null: true
    field :__typename , String, null: true
  end
end
