module Types
  class SmartyVariableType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :response, String, null: true
  end
end
