module Queries
  class FetchBundles < Queries::BaseQuery
    type Types::BundlePageType, null: false
    argument :page, String, required: false

    def resolve(**args)
      bundles = current_shop.bundle_menus.page(args[:page]).order(created_at: :desc)
      {bundles: bundles, total_count: bundles.count, total_pages: bundles.total_pages, page_number: args[:page]}
    end
  end
end
