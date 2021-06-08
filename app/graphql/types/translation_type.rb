module Types
  class TranslationType < Types::BaseObject
    field :id, ID, null: false
    field :sidebar_subscription, String, null: true
    field :sidebar_active, String, null: true
    field :sidebar_cancelled, String, null: true
    field :sidebar_delivery_schedule, String, null: true
    field :sidebar_order_history, String, null: true
    field :sidebar_addresses, String, null: true
    field :sidebar_billing, String, null: true
    field :sidebar_account, String, null: true

    field :home_tab_active_subscriptions, String, null: true
    field :home_tab_no_subscriptions_found, String, null: true
    field :home_tab_quantity, String, null: true
    field :home_tab_edt_button, String, null: true
    field :home_tab_delay_next_order_btn, String, null: true
    field :home_tab_delivery_schedule_btn, String, null: true
    field :home_tab_edit_subscription_btn, String, null: true
    field :home_tab_delivery_address, String, null: true
    field :home_tab_edit_btn, String, null: true
    field :home_tab_recommended_for_you, String, null: true
    field :home_tab_add_subscription, String, null: true
    field :home_tab_apply_discount, String, null: true
    field :home_tab_start_date, String, null: true
    field :home_tab_est_next_delivery, String, null: true
    field :home_tab_last_card_charge, String, null: true

    field :upsell_title, String, null: true
    field :upsell_time_left, String, null: true
    field :upsell_product_variants, String, null: true
    field :upsell_pay_now, String, null: true
    field :upsell_no_thanks, String, null: true
    field :upsell_search_for_product, String, null: true
    field :upsell_search, String, null: true
    field :upsell_clear, String, null: true

    field :delay_popup_choose_date, String, null: true
    field :delay_popup_delay_two_weeks, String, null: true
    field :delay_popup_delay_one_month, String, null: true
    field :delay_popup_delay_two_month, String, null: true
    field :delay_popup_delay_three_month, String, null: true
    field :delay_popup_back, String, null: true
    field :delay_popup_apply, String, null: true

    field :delivery_schedule_popup_next_order, String, null: true
    field :delivery_schedule_popup_order_product, String, null: true
    field :delivery_schedule_popup_order_address, String, null: true
    field :delivery_schedule_popup_scheduled_orders, String, null: true
    field :delivery_schedule_popup_skip, String, null: true
    field :delivery_schedule_popup_back, String, null: true
    field :delivery_schedule_popup_apply, String, null: true

    field :edit_subscription_popup_est_next_delivery, String, null: true
    field :edit_subscription_popup_next_card_charge, String, null: true
    field :edit_subscription_popup_upgrade_subscription, String, null: true
    field :edit_subscription_popup_swap_subscription, String, null: true
    field :edit_subscription_popup_ask_a_question, String, null: true
    field :edit_subscription_popup_cancel_subscription, String, null: true

    field :swap_subscription_popup_swap_subscription_to, String, null: true
    field :swap_subscription_popup_swap_subscription_button, String, null: true

    field :upgrade_subscription_popup_swap_subscription_to, String, null: true
    field :upgrade_subscription_popup_upgrade_subscription_to, String, null: true

    field :cancelled_tab_cancelled_subscriptions, String, null: true
    field :cancelled_tab_reactivate_btn, String, null: true
    field :cancelled_tab_start_date, String, null: true
    field :cancelled_tab_quantity, String, null: true

    field :cancelled_loyalty_cancel_subscription, String, null: true
    field :cancelled_loyalty_get_reward, String, null: true
    field :cancelled_loyalty_cancel_anyway, String, null: true
    field :cancelled_loyalty_keep_points, String, null: true

    field :cancelled_no_loyalty_cancel_anyway, String, null: true
    field :cancelled_no_loyalty_keep_subscription, String, null: true

    field :cancelled_reasons_cancel_subscription, String, null: true
    field :cancelled_reasons_keep_subscription, String, null: true
    field :cancelled_reasons_cancel, String, null: true

    field :delivery_tab_my_next_order, String, null: true
    field :delivery_tab_my_scheduled_order, String, null: true
    field :delivery_tab_no_subscriptions_found, String, null: true
    field :delivery_tab_est_delivery, String, null: true
    field :delivery_tab_order_product, String, null: true
    field :delivery_tab_order_address, String, null: true
    field :delivery_tab_skip, String, null: true
    field :order_history_tab_my_order_history, String, null: true
    field :order_history_tab_no_subscriptions, String, null: true
    field :order_history_tab_date, String, null: true
    field :order_history_tab_amount, String, null: true
    field :order_history_tab_view, String, null: true
    field :order_history_tab_invoice, String, null: true

    field :address_tab_my_address, String, null: true
    field :address_tab_no_subscriptions_found, String, null: true
    field :address_tab_edit, String, null: true
    field :address_tab_phone, String, null: true
    field :address_tab_company, String, null: true
    field :address_tab_address, String, null: true
    field :address_tab_add_address, String, null: true

    field :add_address_popup_first_name, String, null: true
    field :add_address_popup_last_name, String, null: true
    field :add_address_popup_address1, String, null: true
    field :add_address_popup_address2, String, null: true
    field :add_address_popup_company, String, null: true
    field :add_address_popup_city, String, null: true
    field :add_address_popup_country, String, null: true
    field :add_address_popup_zip, String, null: true
    field :add_address_popup_state, String, null: true
    field :add_address_popup_phone, String, null: true
    field :add_address_popup_update, String, null: true

    field :billing_tab_billing_information, String, null: true
    field :billing_tab_billing_no_subscriptions_found, String, null: true
    field :billing_tab_card_on_file, String, null: true
    field :billing_tab_update, String, null: true
    field :billing_tab_edit, String, null: true
    field :billing_tab_phone, String, null: true
    field :billing_tab_company, String, null: true
    field :billing_tab_address, String, null: true

    field :update_payment_popup_card_name, String, null: true
    field :update_payment_popup_card_number, String, null: true
    field :update_payment_popup_exp_month, String, null: true
    field :update_payment_popup_exp_date, String, null: true
    field :update_payment_popup_cvv, String, null: true
    field :update_payment_popup_update_card, String, null: true

    field :account_tab_my_account_detail, String, null: true
    field :account_tab_no_subscriptions_found, String, null: true
    field :account_tab_first_name, String, null: true
    field :account_tab_last_name, String, null: true
    field :account_tab_email, String, null: true
    field :account_tab_save_button, String, null: true
  end
end
