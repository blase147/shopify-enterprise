module Types
  module Input
    class TranslationInputType < Types::BaseInputObject
      argument :id, ID, String, required: false
      argument :sidebar_subscription, String, required: false
      argument :sidebar_active, String, required: false
      argument :sidebar_cancelled, String, required: false
      argument :sidebar_delivery_schedule, String, required: false
      argument :sidebar_order_history, String, required: false
      argument :sidebar_addresses, String, required: false
      argument :sidebar_billing, String, required: false
      argument :sidebar_account, String, required: false

      argument :home_tab_active_subscriptions, String, required: false
      argument :home_tab_no_subscriptions_found, String, required: false
      argument :home_tab_quantity, String, required: false
      argument :home_tab_edt_button, String, required: false
      argument :home_tab_delay_next_order_btn, String, required: false
      argument :home_tab_delivery_schedule_btn, String, required: false
      argument :home_tab_edit_subscription_btn, String, required: false
      argument :home_tab_delivery_address, String, required: false
      argument :home_tab_edit_btn, String, required: false
      argument :home_tab_recommended_for_you, String, required: false
      argument :home_tab_add_subscription, String, required: false
      argument :home_tab_apply_discount, String, required: false
      argument :home_tab_start_date, String, required: false
      argument :home_tab_est_next_delivery, String, required: false
      argument :home_tab_last_card_charge, String, required: false

      argument :upsell_title, String, required: false
      argument :upsell_time_left, String, required: false
      argument :upsell_product_variants, String, required: false
      argument :upsell_pay_now, String, required: false
      argument :upsell_no_thanks, String, required: false
      argument :upsell_search_for_product, String, required: false
      argument :upsell_search, String, required: false
      argument :upsell_clear, String, required: false

      argument :delay_popup_choose_date, String, required: false
      argument :delay_popup_delay_two_weeks, String, required: false
      argument :delay_popup_delay_one_month, String, required: false
      argument :delay_popup_delay_two_month, String, required: false
      argument :delay_popup_delay_three_month, String, required: false
      argument :delay_popup_back, String, required: false
      argument :delay_popup_apply, String, required: false

      argument :delivery_schedule_popup_next_order, String, required: false
      argument :delivery_schedule_popup_order_product, String, required: false
      argument :delivery_schedule_popup_order_address, String, required: false
      argument :delivery_schedule_popup_scheduled_orders, String, required: false
      argument :delivery_schedule_popup_skip, String, required: false
      argument :delivery_schedule_popup_back, String, required: false
      argument :delivery_schedule_popup_apply, String, required: false

      argument :edit_subscription_popup_est_next_delivery, String, required: false
      argument :edit_subscription_popup_next_card_charge, String, required: false
      argument :edit_subscription_popup_upgrade_subscription, String, required: false
      argument :edit_subscription_popup_swap_subscription, String, required: false
      argument :edit_subscription_popup_ask_a_question, String, required: false
      argument :edit_subscription_popup_cancel_subscription, String, required: false

      argument :swap_subscription_popup_swap_subscription_to, String, required: false
      argument :swap_subscription_popup_swap_subscription_button, String, required: false

      argument :upgrade_subscription_popup_swap_subscription_to, String, required: false
      argument :upgrade_subscription_popup_upgrade_subscription_to, String, required: false

      argument :cancelled_tab_cancelled_subscriptions, String, required: false
      argument :cancelled_tab_reactivate_btn, String, required: false
      argument :cancelled_tab_start_date, String, required: false
      argument :cancelled_tab_quantity, String, required: false

      argument :cancelled_loyalty_cancel_subscription, String, required: false
      argument :cancelled_loyalty_get_reward, String, required: false
      argument :cancelled_loyalty_cancel_anyway, String, required: false
      argument :cancelled_loyalty_keep_points, String, required: false

      argument :cancelled_no_loyalty_cancel_anyway, String, required: false
      argument :cancelled_no_loyalty_keep_subscription, String, required: false

      argument :cancelled_reasons_cancel_subscription, String, required: false
      argument :cancelled_reasons_keep_subscription, String, required: false
      argument :cancelled_reasons_cancel, String, required: false

      argument :delivery_tab_my_next_order, String, required: false
      argument :delivery_tab_my_scheduled_order, String, required: false
      argument :delivery_tab_no_subscriptions_found, String, required: false
      argument :delivery_tab_est_delivery, String, required: false
      argument :delivery_tab_order_product, String, required: false
      argument :delivery_tab_order_address, String, required: false
      argument :delivery_tab_skip, String, required: false
      argument :order_history_tab_my_order_history, String, required: false
      argument :order_history_tab_no_subscriptions, String, required: false
      argument :order_history_tab_date, String, required: false
      argument :order_history_tab_amount, String, required: false
      argument :order_history_tab_view, String, required: false
      argument :order_history_tab_invoice, String, required: false

      argument :address_tab_my_address, String, required: false
      argument :address_tab_no_subscriptions_found, String, required: false
      argument :address_tab_edit, String, required: false
      argument :address_tab_phone, String, required: false
      argument :address_tab_company, String, required: false
      argument :address_tab_address, String, required: false
      argument :address_tab_add_address, String, required: false

      argument :add_address_popup_first_name, String, required: false
      argument :add_address_popup_last_name, String, required: false
      argument :add_address_popup_address1, String, required: false
      argument :add_address_popup_address2, String, required: false
      argument :add_address_popup_company, String, required: false
      argument :add_address_popup_city, String, required: false
      argument :add_address_popup_country, String, required: false
      argument :add_address_popup_zip, String, required: false
      argument :add_address_popup_state, String, required: false
      argument :add_address_popup_phone, String, required: false
      argument :add_address_popup_update, String, required: false

      argument :billing_tab_billing_information, String, required: false
      argument :billing_tab_billing_no_subscriptions_found, String, required: false
      argument :billing_tab_card_on_file, String, required: false
      argument :billing_tab_update, String, required: false
      argument :billing_tab_edit, String, required: false
      argument :billing_tab_phone, String, required: false
      argument :billing_tab_company, String, required: false
      argument :billing_tab_address, String, required: false

      argument :update_payment_popup_card_name, String, required: false
      argument :update_payment_popup_card_number, String, required: false
      argument :update_payment_popup_exp_month, String, required: false
      argument :update_payment_popup_exp_date, String, required: false
      argument :update_payment_popup_cvv, String, required: false
      argument :update_payment_popup_update_card, String, required: false

      argument :account_tab_my_account_detail, String, required: false
      argument :account_tab_no_subscriptions_found, String, required: false
      argument :account_tab_first_name, String, required: false
      argument :account_tab_last_name, String, required: false
      argument :account_tab_email, String, required: false
      argument :account_tab_save_button, String, required: false
      argument :__typename, String, required: false
    end
  end
end
