module Types
  module Input
    class SettingInputType < Types::BaseInputObject
      argument :payment_retries, String, required: false
      argument :payment_delay_retries, String, required: false

      argument :__typename, String, required: false
      #customer portal
      argument :themes, String, required: false
      argument :style_header, String, required: false
      argument :style_footer, String, required: false
      argument :style_credit_card, String, required: false
      argument :style_account_profile, String, required: false
      argument :style_sidebar, String, required: false
      argument :style_sidebar_pages, String, required: false
      argument :style_subscription, String, required: false
      argument :style_upsell, String, required: false
      argument :navigation_delivery, String, required: false
      argument :shiping_address, String, required: false
      argument :upcoming_oder_date, String, required: false
      argument :product_to_subscription, String, required: false
      argument :change_variant, String, required: false
      argument :swap_product, String, required: false
      argument :shipment, String, required: false
      argument :frequency, String, required: false
      argument :facing_frequency_option, [String], required: false
      argument :one_time_purchase, String, required: false
      argument :available_purchase, String, required: false
      argument :discount, [String], required: false
      argument :subscription_cancellation, String, required: false
      argument :cancellation_email_contact, String, required: false
      argument :allow_cancel_after, String, required: false
      argument :reactive_subscription, String, required: false
      argument :upcoming_quantity, String, required: false
      argument :reasons_cancels, [Types::Input::ReasonsCancelInputType], required: false
      argument :show_promo_button, String, required: false
      argument :promo_button_content, String, required: false
      argument :promo_button_url, String, required: false
      argument :contact_box_content, String, required: false
      argument :promo_tagline1_content, String, required: false
      argument :promo_tagline2_content, String, required: false
      argument :show_subscription, String, required: false
      argument :show_delivery_schedule, String, required: false
      argument :show_order_history, String, required: false
      argument :show_address, String, required: false
      argument :show_billing, String, required: false
      argument :show_account, String, required: false
      argument :delay_order, String, required: false
      argument :pause_subscription, String, required: false

      #email notification
      argument :email_notifications, [Types::Input::EmailNotificationInputType], required: false
      argument :additional_send_account_after_checkout, GraphQL::Types::Boolean, required: false
      argument :bbc_storeowner, GraphQL::Types::Boolean, required: false
      argument :cc_storeowner, GraphQL::Types::Boolean, required: false
      argument :send_shopify_receipt, GraphQL::Types::Boolean, required: false
      argument :send_fullfillment, GraphQL::Types::Boolean, required: false
      argument :email_service, String, required: false

      #dunning
      argument :activate_dunning_for_cards, GraphQL::Types::Boolean, required: false
      argument :dunning_period, String, required: false
      argument :retry_frequency, String, required: false
      argument :happens_to_subscriptions, String, required: false
      argument :happens_to_invoices, String, required: false
      argument :dunning_future_trial_subscriptions, GraphQL::Types::Boolean, required: false
      argument :dunning_one_time_invoice, GraphQL::Types::Boolean, required: false
      argument :activate_dunning_direct_debit, GraphQL::Types::Boolean, required: false
      argument :direct_debit_subscription, String, required: false
      argument :direct_debit_invoice, String, required: false
      argument :dunning_offline_configure, GraphQL::Types::Boolean, required: false
      argument :dunning_offline_peiod, String, required: false
      argument :dunning_offline_subscription, String, required: false
      argument :dunning_offline_invoice, String, required: false
      argument :choose_automatic_retry_mode, String, required: false
      argument :dunning_card_configure, GraphQL::Types::Boolean, required: false

      #store Information
      argument :store_name, String, required: false
      argument :store_email, String, required: false
      argument :storefront_password, String, required: false

      #legal
      argument :checkout_subscription_terms, String, required: false
      argument :email_subscription_terms, String, required: false
      argument :apple_pay_subscription_terms, String, required: false

      #shop_date
      argument :recurring_charge_status, String, required: false
      argument :charge_confirmation_link, String, required: false
    end
  end
end
