class AddCustomerPortalToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :themes, :string
    add_column :settings, :style_header, :text
    add_column :settings, :style_footer, :text
    add_column :settings, :style_credit_card, :text
    add_column :settings, :navigation_delivery, :string
    add_column :settings, :shiping_address, :string
    add_column :settings, :upcoming_oder_date, :string
    add_column :settings, :product_to_subscription, :string
    add_column :settings, :change_variant, :string
    add_column :settings, :swap_product, :string
    add_column :settings, :shipment, :string
    add_column :settings, :frequency, :string
    add_column :settings, :facing_frequency_option, :string
    add_column :settings, :one_time_purchase, :string
    add_column :settings, :available_purchase, :string
    add_column :settings, :discount, :string
    add_column :settings, :subscription_cancellation, :string
    add_column :settings, :cancellation_email_contact, :string
    add_column :settings, :allow_cancel_after, :string
    add_column :settings, :reactive_subscription, :string
  end
end
