module Types
    class StaffMembersPageType  < Types::BaseObject
        field :staff_members, [Types::StaffMembersType], null: true
        field :total_count, String, null: true
        field :total_pages, String, null: true
        field :page_number, String, null: true
    end
end