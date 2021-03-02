class CreateUpsellCampaigns < ActiveRecord::Migration[6.0]
  def change
    create_table :upsell_campaigns do |t|
      t.string :name
      t.string :selector_label
      t.text :description
      t.integer :interval_type
      t.integer :interval_count

      t.boolean :rule_cart, default: false
      t.integer :rule_cart_condition
      t.string :rule_cart_value

      t.boolean :rule_customer, default: false
      t.integer :rule_customer_condition
      t.string :rule_customer_value

      t.boolean :rule_order, default: false
      t.integer :rule_order_condition
      t.string :rule_order_value

      t.boolean :rule_product, default: false
      t.integer :rule_product_condition
      t.string :rule_product_value

      t.string :product_name
      t.string :product_value
      t.boolean :product_display_quantity
      t.boolean :product_limit_quantity
      t.integer :product_quantity_value

      t.integer :template
      t.boolean :show_offer_title
      t.string :offer_title
      t.boolean :show_timer
      t.string :background_color

      t.integer :button_position
      t.integer :button_text_accept
      t.integer :button_text_decline

      t.integer :shop_id

      t.timestamps
    end
  end
end
