module Queries
    class FetchStaffMembers < Queries::BaseQuery

      type Types::StaffMembersPageType, null: false
      argument :page, String, required: false
      argument :searchquery, String, required: false

      def resolve(**args)
        if current_user.present?
            if args[:searchquery].present?
                staff_members = ShopUser.where(role: "staff", shop_id: current_shop.id).joins(:user).search(args[:searchquery]).page(args[:page])
            else
                staff_members = ShopUser.where(role: "staff", shop_id: current_shop.id).page(args[:page])
            end
            {staff_members: staff_members, total_count: staff_members.count, total_pages: staff_members.total_pages, page_number: args[:page]}
        end
      end
    end
end