module Types
  module Input
    class WeeklyMenuInputType < Types::BaseInputObject
      argument :id, String, required: false

      argument :cutoff_date, String, required: false
      argument :week, String, required: false
      argument :display_name, String, required: false
      argument :box_subscription_type, String, required: false
      argument :product_images, [Types::Input::ProductInputType], required: false
      argument :collection_images, [Types::Input::CollectionInputType], required: false
      argument :triggers, [Types::Input::TriggerInputType], required: false
      argument :selling_plans, [Types::Input::RuleCustomerValueInputType], required: false

      argument :__typename, String, required: false
      argument :_destroy, GraphQL::Types::Boolean, required: false
    end
  end
end
