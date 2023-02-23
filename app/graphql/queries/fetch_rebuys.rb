module Queries
    class FetchRebuys < Queries::BaseQuery
  
      type Types::RebuyPageType, null: true
      argument :page, String, required: false
      def resolve **args
        rebuys = current_shop.rebuys.order(created_at: :desc).page(args[:page])
        {rebuys: rebuys, total_count: rebuys.count, total_pages: rebuys.total_pages, page_number: args[:page]}
      end
    end
end