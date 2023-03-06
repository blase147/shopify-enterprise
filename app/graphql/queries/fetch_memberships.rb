module Queries
    class FetchMemberships < Queries::BaseQuery
  
      type Types::MembershipPageType, null: true
      argument :page, String, required: false
      def resolve **args
        memberships = current_shop.memberships.order(created_at: :desc).page(args[:page])
        {memberships: memberships, total_count: memberships.count, total_pages: memberships.total_pages, page_number: args[:page]}
      end
    end
end