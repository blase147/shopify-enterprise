class CreateTranslationTable < ActiveRecord::Migration[6.0]
  def change
    create_table :translations do |t|
      t.references :shop
      t.string :sidebar_subscription
      t.string :sidebar_active
      t.string :sidebar_cancelled
      t.string :sidebar_delivery_schedule
      t.string :sidebar_order_history
      t.string :sidebar_addresses
      t.string :sidebar_billing
      t.string :sidebar_account

      t.string :home_tab_active_subscriptions
      t.string :home_tab_no_subscriptions_found
      t.string :home_tab_quantity
      t.string :home_tab_edt_button
      t.string :home_tab_delay_next_order_btn
      t.string :home_tab_delivery_schedule_btn
      t.string :home_tab_edit_subscription_btn
      t.string :home_tab_delivery_address
      t.string :home_tab_edit_btn
      t.string :home_tab_recommended_for_you
      t.string :home_tab_add_subscription
      t.string :home_tab_apply_discount
      t.string :home_tab_start_date
      t.string :home_tab_est_next_delivery
      t.string :home_tab_last_card_charge

      t.string :upsell_title
      t.string :upsell_time_left
      t.string :upsell_product_variants
      t.string :upsell_pay_now
      t.string :upsell_no_thanks
      t.string :upsell_search_for_product
      t.string :upsell_search
      t.string :upsell_clear

      t.string :delay_popup_choose_date
      t.string :delay_popup_delay_two_weeks
      t.string :delay_popup_delay_one_month
      t.string :delay_popup_delay_two_month
      t.string :delay_popup_delay_three_month
      t.string :delay_popup_back
      t.string :delay_popup_apply

      t.string :delivery_schedule_popup_next_order
      t.string :delivery_schedule_popup_order_product
      t.string :delivery_schedule_popup_order_address
      t.string :delivery_schedule_popup_scheduled_orders
      t.string :delivery_schedule_popup_skip
      t.string :delivery_schedule_popup_back
      t.string :delivery_schedule_popup_apply

      t.string :edit_subscription_popup_est_next_delivery
      t.string :edit_subscription_popup_next_card_charge
      t.string :edit_subscription_popup_upgrade_subscription
      t.string :edit_subscription_popup_swap_subscription
      t.string :edit_subscription_popup_ask_a_question
      t.string :edit_subscription_popup_cancel_subscription

      t.string :swap_subscription_popup_swap_subscription_to
      t.string :swap_subscription_popup_swap_subscription_button

      t.string :upgrade_subscription_popup_swap_subscription_to
      t.string :upgrade_subscription_popup_upgrade_subscription_btn

      t.string :cancelled_tab_cancelled_subscriptions
      t.string :cancelled_tab_reactivate_btn
      t.string :cancelled_tab_start_date
      t.string :cancelled_tab_quantity

      t.string :cancelled_loyalty_cancel_subscription
      t.string :cancelled_loyalty_get_reward
      t.string :cancelled_loyalty_cancel_anyway
      t.string :cancelled_loyalty_keep_points

      t.string :cancelled_no_loyalty_cancel_anyway
      t.string :cancelled_no_loyalty_keep_subscription

      t.string :cancelled_reasons_cancel_subscription
      t.string :cancelled_reasons_keep_subscription
      t.string :cancelled_reasons_cancel

      t.string :delivery_tab_my_next_order
      t.string :delivery_tab_my_scheduled_order
      t.string :delivery_tab_no_subscriptions_found
      t.string :delivery_tab_est_delivery
      t.string :delivery_tab_order_product
      t.string :delivery_tab_order_address
      t.string :delivery_tab_skip
      t.string :order_history_tab_my_order_history
      t.string :order_history_tab_order_no
      t.string :order_history_tab_no_subscriptions
      t.string :order_history_tab_date
      t.string :order_history_tab_amount
      t.string :order_history_tab_view
      t.string :order_history_tab_invoice

      t.string :address_tab_my_address
      t.text :address_tab_no_subscriptions_found
      t.string :address_tab_edit
      t.string :address_tab_phone
      t.string :address_tab_company
      t.string :address_tab_address
      t.string :address_tab_add_address

      t.string :add_address_popup_first_name
      t.string :add_address_popup_last_name
      t.string :add_address_popup_address1
      t.string :add_address_popup_address2
      t.string :add_address_popup_company
      t.string :add_address_popup_city
      t.string :add_address_popup_country
      t.string :add_address_popup_zip
      t.string :add_address_popup_state
      t.string :add_address_popup_phone
      t.string :add_address_popup_update

      t.string :billing_tab_billing_information
      t.text :billing_tab_billing_no_subscriptions_found
      t.string :billing_tab_card_on_file
      t.string :billing_tab_update
      t.string :billing_tab_edit
      t.string :billing_tab_phone
      t.string :billing_tab_company
      t.string :billing_tab_address

      t.string :update_payment_popup_card_name
      t.string :update_payment_popup_card_number
      t.string :update_payment_popup_exp_month
      t.string :update_payment_popup_exp_date
      t.string :update_payment_popup_cvv
      t.string :update_payment_popup_update_card

      t.string :account_tab_my_account_detail
      t.text :account_tab_no_subscriptions_found
      t.string :account_tab_first_name
      t.string :account_tab_last_name
      t.string :account_tab_email
      t.string :account_tab_save_button
    end
  end
end
