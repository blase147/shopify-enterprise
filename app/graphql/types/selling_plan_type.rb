module Types
  class SellingPlanType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true

    field :adjustment_value, String, null: true
    field :adjustment_type, String, null: true
    field :min_fullfilment, String, null: true
    field :max_fullfilment, String, null: true
    field :interval_type, String, null: true
    field :interval_count, String, null: true

    field :trial_adjustment_value, String, null: true
    field :trial_adjustment_type, String, null: true
    field :trial_interval_type, String, null: true
    field :trial_interval_count, String, null: true

    field :build_a_box_min_number, String, null: true
    field :build_a_box_max_number, String, null: true
    field :build_a_box_duration, String, null: true
    field :build_a_box_duration_value, String, null: true

    field :mystery_duration, String, null: true
    field :mystery_duration_value, String, null: true

    field :product_images, [Types::ProductType], null: true

    field :description, String, null: true
    field :selector_label, String, null: true
    field :_destroy, GraphQL::Types::Boolean, null: false
  end
end
