module Types
  class SellingPlanType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :shopify_id, String, null: true

    field :adjustment_value, String, null: true
    field :adjustment_type, String, null: true
    field :min_fullfilment, String, null: true
    field :max_fullfilment, String, null: true
    field :interval_type, String, null: true
    field :interval_count, String, null: true

    field :delivery_interval_type, String, null: true
    field :delivery_interval_count, String, null: true

    field :trial_adjustment_value, String, null: true
    field :trial_adjustment_type, String, null: true
    field :trial_interval_type, String, null: true
    field :trial_interval_count, String, null: true

    field :box_subscription_type, Int, null: true
    field :box_is_quantity, GraphQL::Types::Boolean, null: true
    field :box_is_quantity_limited, GraphQL::Types::Boolean, null: true
    field :box_quantity_limit, Int, null: true

    field :mystery_duration, String, null: true
    field :mystery_duration_value, String, null: true

    field :product_images, [Types::ProductType], null: true
    field :collection_images, [Types::CollectionType], null: true

    field :description, String, null: true
    field :selector_label, String, null: true
    field :billing_dates, [String], null: true
    field :shipping_dates, [String], null: true

    field :shipping_cut_off, Int, null: true
    field :first_delivery, String, null: true

    field :_destroy, GraphQL::Types::Boolean, null: false

    def box_subscription_type
      SellingPlan.box_subscription_types[object.box_subscription_type]
    end
  end
end
