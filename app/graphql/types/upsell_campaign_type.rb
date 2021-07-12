module Types
  class UpsellCampaignType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :selector_label, String, null: true
    field :description, String, null: true
    field :interval_type, String, null: true
    field :interval_count, String, null: true

    field :rule_cart, GraphQL::Types::Boolean, null: true
    field :rule_cart_condition, String, null: true
    field :rule_cart_value, Types::ProductType, null: true

    field :rule_customer, GraphQL::Types::Boolean, null: true
    field :rule_customer_condition, String, null: true
    field :rule_customer_value, Types::RuleCustomerValueType, null: true

    field :rule_order, GraphQL::Types::Boolean, null: true
    field :rule_order_condition, String, null: true
    field :rule_order_value, String, null: true

    field :rule_product, GraphQL::Types::Boolean, null: true
    field :rule_product_condition, String, null: true
    field :rule_product_value, String, null: true

    field :product_offer, [Types::ProductType], null: true
    field :product_display_quantity, String, null: true
    field :product_limit_quantity, GraphQL::Types::Boolean, null: true
    field :product_quantity_value, String, null: true
    field :template, String, null: true
    field :show_offer_title, String, null: true
    field :offer_title, String, null: true
    field :show_timer, String, null: true
    field :background_color, String, null: true
    field :button_position, String, null: true
    field :button_text_accept, String, null: true
    field :button_text_decline, String, null: true

    field :_destroy, GraphQL::Types::Boolean, null: false
  end
end
