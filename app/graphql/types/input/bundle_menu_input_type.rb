module Types
  module Input
    class BundleMenuInputType < Types::BaseInputObject
      argument :id, ID,required: false
      argument :title, String, required: false
      argument :shop_id, String, required: false
      argument :subheading_i, String, required: false
      argument :subheading_ii, String, required: false
      argument :subheading_iii, String, required: false
      argument :bundle_style, String, required: false
      argument :selling_plans, [Types::Input::RuleCustomerValueInputType], required: false
      argument :selling_plan_ids, String, required: false
      argument :product_images, [Types::Input::ProductInputType], required: false
      argument :collection_images, [Types::Input::CollectionInputType], required: false
      argument :break_point_price_i, String, required: false
      argument :break_point_price_ii, String, required: false
      argument :break_point_price_iii, String, required: false
      argument :number_of_options, String, required: false
      argument :free_product_collections, [Types::Input::CollectionInputType], required: false
      argument :free_products_images, [Types::Input::ProductInputType], required: false
    end
  end
end
