module Types
  class ThemeType < Types::BaseObject
    field :id, String, null: true
    field :name, String, null: true
    field :role, String, null: true
  end
end
