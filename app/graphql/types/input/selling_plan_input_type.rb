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

      argument :trial_adjustment_value, String, required: false
      argument :trial_adjustment_type, String, required: false
      argument :trial_interval_type, String, required: false
      argument :trial_interval_count, String, required: false

      argument :build_a_box_min_number, String, required: false
      argument :build_a_box_max_number, String, required: false
      argument :build_a_box_duration, String, required: false
      argument :build_a_box_duration_value, String, required: false

      argument :mystery_duration, String, required: false
      argument :mystery_duration_value, String, required: false

      argument :product_images, [Types::Input::ProductInputType], required: false

      argument :description, String, required: false
      argument :selector_label, String, required: false
      
      argument :__typename, String, required: false
      argument :_destroy, GraphQL::Types::Boolean, required: false
    end
  end
end
