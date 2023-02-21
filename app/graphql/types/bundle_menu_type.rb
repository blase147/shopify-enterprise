module Types
  class BundleMenuType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: true
    field :subheading_i, String, null: true
    field :subheading_ii, String, null: true
    field :subheading_iii, String, null: true
    field :bundle_style, String, null: true
    field :selling_plans, [Types::RuleCustomerValueType], null: true
    field :product_images, [Types::ProductType], null: true
    field :collection_images, [Types::CollectionType], null: true
    field :break_point_price_i, String, null: true

    field :break_point_price_ii, String, null: true
    field :break_point_price_iii, String, null: true
    field :number_of_options, String, null: true
    field :free_product_collections, [Types::CollectionType], null: true
    field :free_products_images, [Types::ProductType], null: true

    field :created_at, String, null: true
    field :updated_at, String, null: true

    def created_at
      object.created_at&.strftime('%b %d %Y, %I:%M %p')
    end

    def updated_at
      object. updated_at&.strftime('%b %d %Y, %I:%M %p')
    end
  end
end
