class UpsellCampaign < ApplicationRecord
  enum status: %w(draft publish)

  enum interval_type: %w(day week month year)

  enum rule_cart_condition: %w(cart_any)
  enum rule_customer_condition: %w(customder_any)
  enum rule_order_condition: %w(order_less_equal order_greater_equal)
  enum rule_product_condition: %w(product_less_equal product_greater_equal)

  enum template: %w(one_column two_column)

  enum button_position: %w(top bottom)
  belongs_to :upsell_campaign_group

  # validates_presence_of :name, :selector_label
end
