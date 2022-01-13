module Types
  module Input
    class SellingPlanInputType < Types::BaseInputObject
      argument :id, String, required: false
      argument :name, String, required: true

      argument :adjustment_value, String, required: false
      argument :adjustment_type, String, required: false
      argument :min_fullfilment, String, required: false
      argument :max_fullfilment, String, required: false
      argument :interval_type, String, required: false
      argument :interval_count, String, required: false

      argument :delivery_interval_type, String, required: false
      argument :delivery_interval_count, String, required: false

      argument :trial_adjustment_value, String, required: false
      argument :trial_adjustment_type, String, required: false
      argument :trial_interval_type, String, required: false
      argument :trial_interval_count, String, required: false

      argument :box_subscription_type, Int, required: false
      argument :box_is_quantity, GraphQL::Types::Boolean, required: false
      argument :box_is_quantity_limited, GraphQL::Types::Boolean, required: false
      argument :box_quantity_limit, Int, required: false

      argument :mystery_duration, String, required: false
      argument :mystery_duration_value, String, required: false

      argument :product_images, [Types::Input::ProductInputType], required: false
      argument :collection_images, [Types::Input::CollectionInputType], required: false

      argument :description, String, required: false
      argument :selector_label, String, required: false

      argument :billing_dates, [String], required: false
      argument :shipping_dates, [String], required: false

      argument :shipping_cut_off, Int, required: false
      argument :first_delivery, String, required: false

      argument :__typename, String, required: false
      argument :_destroy, GraphQL::Types::Boolean, required: false
    end
  end
end
