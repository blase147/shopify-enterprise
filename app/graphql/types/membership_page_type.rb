module Types
  class MembershipPageType < Types::BaseObject
    field :memberships, [Types::MembershipType], null: true
    field :total_count, String, null: true
    field :total_pages, String, null: true
    field :page_number, String, null: true
  end
end
