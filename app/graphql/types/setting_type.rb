module Types
  class SettingType < Types::BaseObject
    field :account_portal_option, String, null: true
    #billing
    field :payment_retries, String, null: true
    field :payment_delay_retries, String, null: true
    field :max_fail_strategy, String, null: true
    field :active_subscription_btn_seq, [String], null: true

    #customer portal
    field :order_cancel_option, String, null: true
    field :day_of_production, String, null: true
    field :delivery_interval_after_production, String, null: true
    field :eligible_weekdays_for_delivery, String, null: true
    field :themes, String, null: true
    field :style_header, String, null: true
    field :style_footer, String, null: true
    field :style_credit_card, String, null: true
    field :style_account_profile, String, null: true
    field :style_sidebar, String, null: true
    field :style_sidebar_pages, String, null: true
    field :style_subscription, String, null: true
    field :style_upsell, String, null: true
    field :navigation_delivery, String, null: true
    field :shiping_address, String, null: true
    field :upcoming_oder_date, String, null: true
    field :product_to_subscription, String, null: true
    field :change_variant, String, null: true
    field :swap_product, String, null: true
    field :shipment, String, null: true
    field :frequency, String, null: true
    field :facing_frequency_option, [String], null: true
    field :one_time_purchase, String, null: true
    field :available_purchase, String, null: true
    field :discount, [String], null: true
    field :subscription_cancellation, String, null: true
    field :cancellation_email_contact, String, null: true
    field :allow_cancel_after, String, null: true
    field :reactive_subscription, String, null: true
    field :upcoming_quantity, String, null: true
    field :reasons_cancels, [Types::ReasonsCancelType], null: true
    field :show_promo_button, String, null: true
    field :promo_button_content, String, null: true
    field :promo_button_url, String, null: true
    field :contact_box_content, String, null: true
    field :promo_tagline1_content, String, null: true
    field :promo_tagline2_content, String, null: true
    field :show_subscription, String, null: true
    field :show_delivery_schedule, String, null: true
    field :show_order_history, String, null: true
    field :show_address, String, null: true
    field :show_billing, String, null: true
    field :show_account, String, null: true
    field :delay_order, String, null: true
    field :pause_subscription, String, null: true
    field :design_type, String, null: true

    #email notification
    field :email_notifications, [Types::EmailNotificationType], null: true
    field :additional_send_account_after_checkout, GraphQL::Types::Boolean, null: true
    field :bbc_storeowner, GraphQL::Types::Boolean, null: true
    field :cc_storeowner, GraphQL::Types::Boolean, null: true
    field :send_shopify_receipt, GraphQL::Types::Boolean, null: true
    field :send_fullfillment, GraphQL::Types::Boolean, null: true
    field :email_service, String, null: true

    #dunning
    field :activate_dunning_for_cards, GraphQL::Types::Boolean, null: true
    field :dunning_period, String, null: true
    field :retry_frequency, String, null: true
    field :happens_to_subscriptions, String, null: true
    field :happens_to_invoices, String, null: true
    field :dunning_future_trial_subscriptions, GraphQL::Types::Boolean, null: true
    field :dunning_one_time_invoice, GraphQL::Types::Boolean, null: true
    field :activate_dunning_direct_debit, GraphQL::Types::Boolean, null: true
    field :direct_debit_subscription, String, null: true
    field :direct_debit_invoice, String, null: true
    field :dunning_offline_configure, GraphQL::Types::Boolean, null: true
    field :dunning_offline_peiod, String, null: true
    field :dunning_offline_subscription, String, null: true
    field :dunning_offline_invoice, String, null: true
    field :choose_automatic_retry_mode, String, null: true
    field :dunning_card_configure, GraphQL::Types::Boolean, null: true

    #store Information
    field :store_name, String, null: true
    field :store_email, String, null: true
    field :storefront_password, String, null: true
    field :enable_password, Boolean, null: true

    #legal
    field :checkout_subscription_terms, String, null: true
    field :email_subscription_terms, String, null: true
    field :apple_pay_subscription_terms, String, null: true

    #shop_data
    field :recurring_charge_status, String, null: true
    field :charge_confirmation_link, String, null: true
    field :plan, String, null: true

    # def reasons_cancels
    #   object.reasons_cancels
    # end

    def plan
      object.shop.plan
    end

    def recurring_charge_status
      object.shop.recurring_charge_status
    end

    def charge_confirmation_link
      object.shop.charge_confirmation_link
    end
  end
end
