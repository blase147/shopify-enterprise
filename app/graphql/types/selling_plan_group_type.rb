include ActionView::Helpers::NumberHelper

module Types
  class SellingPlanGroupType < Types::BaseObject
    field :id, ID, null: false
    field :public_name, String, null: true
    field :internal_name, String, null: true
    field :name, String, null: true
    field :plan_selector_title, String, null: true
    field :product_ids, [Types::ProductType], null: true
    field :variant_ids, [Types::VariantType], null: true
    field :selling_plans, [Types::SellingPlanType], null: false

    field :billing_period, String, null: true
    field :price, String, null: true
    field :subscription_model, String, null: true
    field :trial_period, String, null: true
    field :name, String, null: false
    field :active, GraphQL::Types::Boolean, null: false
    field :plan_type, String, null: false

    def billing_period
      object.billing_plan
    end

    def name
      object.public_name
    end

    def price
      number_to_currency(object.price, precision: 0)
    end

    def subscription_model
      object.plan_type&.humanize
    end

    def trial_period
      object.trial ? "#{object.trial} Days" : 'N/A'
    end
  end
end
