module Types
  module Input
    class UpsellCampaignInputType < Types::BaseInputObject
      argument :id, String, required: false
      argument :name, String, required: true

      argument :selector_label, String, required: false
      argument :description, String, required: false
      argument :interval_type, String, required: false
      argument :interval_count, String, required: false

      argument :rule_cart, GraphQL::Types::Boolean, required: false
      argument :rule_cart_condition, String, required: false
      argument :rule_cart_value, Types::Input::ProductInputType, required: false

      argument :rule_customer, GraphQL::Types::Boolean, required: false
      argument :rule_customer_condition, String, required: false
      argument :rule_customer_value, Types::Input::RuleCustomerValueInputType, required: false

      argument :rule_order, GraphQL::Types::Boolean, required: false
      argument :rule_order_condition, String, required: false
      argument :rule_order_value, String, required: false

      argument :rule_product, GraphQL::Types::Boolean, required: false
      argument :rule_product_condition, String, required: false
      argument :rule_product_value, String, required: false

      argument :product_offer, [Types::Input::ProductInputType], required: false
      argument :product_display_quantity, String, required: false
      argument :product_limit_quantity, GraphQL::Types::Boolean, required: false
      argument :product_quantity_value, String, required: false
      argument :template, String, required: false
      argument :show_offer_title, String, required: false
      argument :offer_title, String, required: false
      argument :show_timer, String, required: false
      argument :background_color, String, required: false
      argument :button_position, String, required: false
      argument :button_text_accept, String, required: false
      argument :button_text_decline, String, required: false

      argument :__typename, String, required: false
      argument :_destroy, GraphQL::Types::Boolean, required: false
    end
  end
end
