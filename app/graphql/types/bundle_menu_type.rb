module Types
  class BundleMenuType < Types::BaseObject
    field :id, ID,null: true
    field :title, String, null: true
    field :shop_id, String, null: true
    field :subheading_i, String, null: true
    field :subheading_ii, String, null: true
    field :subheading_iii, String, null: true
    field :bundle_style, String, null: true
    field :selling_plans, String, null: true
    field :selling_plan_ids, String, null: true
    field :product_images, String, null: true
    field :collection_images, String, null: true
    field :break_point_price_i, String, null: true
    field :break_point_price_ii, String, null: true
    field :break_point_price_iii, String, null: true
    field :number_of_options, String, null: true
    field :free_product_collections, String, null: true
    field :free_products_images, String, null: true
  end
end
