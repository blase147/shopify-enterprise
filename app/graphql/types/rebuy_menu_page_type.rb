module Types
  class RebuyMenuPageType < Types::BaseObject
    field :rebuy_menus, [Types::RebuyMenuType], null: true
    field :total_count, String, null: true
    field :total_pages, String, null: true
    field :page_number, String, null: true
  end
end
