module Queries
    class FetchStaffMembers < Queries::BaseQuery

      type Types::StaffMembersPageType, null: false
      argument :page, String, required: false
      argument :searchquery, String, required: false
      argument :shop_domain, String, required: false

      def resolve(**args)
        current_shop = Shop.find_by_shopify_domain(args[:shop_domain]) rescue current_shop
        if current_user.present?
            if args[:searchquery].present?
                staff_members = UserShop.where(role: "staff", shop_id: current_shop.id).joins(:user).search(args[:searchquery]).page(args[:page])
            else
                staff_members = UserShop.where(role: "staff", shop_id: current_shop.id).page(args[:page])
            end
            {staff_members: staff_members, total_count: staff_members.count, total_pages: staff_members.total_pages, page_number: args[:page]}
        end
      end
    end
end