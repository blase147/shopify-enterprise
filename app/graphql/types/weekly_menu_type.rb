module Types
  class WeeklyMenuType < Types::BaseObject
    field :id, ID, null: false
    field :cutoff_date, String, null: true
    field :display_name, String, null: true
    field :week, Integer, null: false
    field :box_subscription_type, String, null: true
    field :collection_images, [Types::CollectionType], null: true
    field :product_images, [Types::ProductType], null: true
    field :triggers, [Types::TriggerType], null: true
    field :selling_plans, [Types::RuleCustomerValueType], null: true

    field :__typename, String, null: true
    field :_destroy, GraphQL::Types::Boolean, null: false
  end
end
