module Types
  module Input
    class SellingPlanGroupInputType < Types::BaseInputObject
      argument :id, String, required: false

      argument :public_name, String, required: true
      argument :internal_name, String, required: true
      argument :plan_selector_title, String, required: true
      argument :active, GraphQL::Types::Boolean, required: true
      argument :product_ids, [Types::Input::ProductInputType], required: false
      argument :variant_ids, [Types::Input::VariantInputType], required: false

      argument :selling_plans, [Types::Input::SellingPlanInputType], required: false
      argument :__typename, String, required: false
      argument :plan_type, String, required: false
    end
  end
end
