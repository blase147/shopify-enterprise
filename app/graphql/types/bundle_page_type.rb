module Types
  class BundlePageType < Types::BaseObject
    field :bundles, [Types::BundleMenuType], null: true
    field :total_count, String, null: true
    field :total_pages, String, null: true
    field :page_number, String, null: true
  end
end
