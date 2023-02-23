module Types
  class RebuyPageType < Types::BaseObject
    field :rebuys, [Types::RebuyType], null: true
    field :total_count, String, null: true
    field :total_pages, String, null: true
    field :page_number, String, null: true
  end
end
