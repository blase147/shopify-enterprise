module Queries
    class FetchRebuyMenus < Queries::BaseQuery
  
      type Types::RebuyMenuPageType, null: true
      argument :page, String, required: false
      def resolve **args
        rebuy_menus = current_shop.rebuy_menus.order(created_at: :desc).page(args[:page])
        {rebuy_menus: rebuy_menus, total_count: rebuy_menus.count, total_pages: rebuy_menus.total_pages, page_number: args[:page]}
      end
    end
end