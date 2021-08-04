# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_08_04_055156) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "additional_contacts", force: :cascade do |t|
    t.integer "customer_id"
    t.string "email"
    t.string "first_name"
    t.string "last_name"
    t.string "company_name"
    t.string "phone"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "billing_addresses", force: :cascade do |t|
    t.string "language"
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "company"
    t.string "address_1"
    t.string "address_2"
    t.string "city"
    t.string "zip_code"
    t.integer "customer_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "phone"
  end

  create_table "build_a_box_campaign_groups", force: :cascade do |t|
    t.bigint "shop_id"
    t.string "internal_name"
    t.string "location"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shop_id"], name: "index_build_a_box_campaign_groups_on_shop_id"
  end

  create_table "build_a_box_campaigns", force: :cascade do |t|
    t.bigint "build_a_box_campaign_group_id"
    t.date "start_date"
    t.date "end_date"
    t.integer "box_quantity_limit"
    t.integer "box_subscription_type"
    t.json "collection_images"
    t.json "product_images"
    t.json "triggers"
    t.json "selling_plans"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["build_a_box_campaign_group_id"], name: "index_build_a_box_campaigns_on_build_a_box_campaign_group_id"
  end

  create_table "custom_keywords", force: :cascade do |t|
    t.text "response"
    t.text "keywords", default: [], array: true
    t.integer "status", default: 0
    t.bigint "shop_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shop_id"], name: "index_custom_keywords_on_shop_id"
  end

  create_table "customers", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "phone"
    t.string "address_1"
    t.string "address_2"
    t.integer "gender"
    t.string "communication"
    t.string "avatar"
    t.date "birthday"
    t.string "shopify_id"
    t.integer "shop_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "status"
    t.string "subscription"
    t.string "language"
    t.boolean "auto_collection"
    t.string "pack"
    t.string "frequency"
    t.datetime "shopify_at"
    t.string "country"
    t.string "city"
    t.string "province"
    t.string "zip"
    t.string "company"
    t.datetime "shopify_updated_at"
    t.boolean "opt_in_sent", default: false
    t.datetime "opt_in_reminder_at"
    t.datetime "failed_at"
    t.integer "retry_count", default: 0
    t.bigint "reasons_cancel_id"
    t.datetime "cancelled_at"
    t.string "biiling_interval"
    t.string "shopify_customer_id"
    t.string "box_items"
    t.datetime "campaign_date"
    t.index ["reasons_cancel_id"], name: "index_customers_on_reasons_cancel_id"
  end

  create_table "email_notifications", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "from_name"
    t.string "from_email"
    t.string "email_subject"
    t.text "email_message"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "status"
    t.integer "setting_id"
    t.string "slug"
    t.string "template_identity"
    t.text "hypertext"
  end

  create_table "integrations", force: :cascade do |t|
    t.integer "integration_type", default: 0
    t.string "name"
    t.string "image_url"
    t.json "credentials"
    t.integer "status", default: 0
    t.integer "service_type", default: 0
    t.bigint "shop_id"
    t.boolean "default", default: false
    t.string "keys"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shop_id"], name: "index_integrations_on_shop_id"
  end

  create_table "lock_passwords", force: :cascade do |t|
    t.integer "shop_id"
    t.string "password_digest", null: false
    t.datetime "created_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "reasons_cancels", force: :cascade do |t|
    t.string "title"
    t.string "return_content"
    t.integer "setting_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "removed_subscription_lines", force: :cascade do |t|
    t.string "subscription_id"
    t.string "customer_id"
    t.string "variant_id"
    t.integer "quantity"
  end

  create_table "report_logs", force: :cascade do |t|
    t.integer "report_type"
    t.date "start_date"
    t.date "end_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "selling_plan_groups", force: :cascade do |t|
    t.string "internal_name"
    t.string "public_name"
    t.string "plan_selector_title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "shop_id"
    t.string "shopify_id"
    t.integer "plan_type"
    t.string "billing_plan"
    t.decimal "price"
    t.integer "trial"
    t.boolean "active", default: true
    t.json "product_ids"
    t.json "variant_ids"
  end

  create_table "selling_plans", force: :cascade do |t|
    t.integer "selling_plan_group_id"
    t.string "name"
    t.string "selector_label"
    t.text "description"
    t.string "interval_type"
    t.integer "interval_count"
    t.integer "min_fullfilment"
    t.integer "max_fullfilment"
    t.string "adjustment_type"
    t.decimal "adjustment_value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "shopify_id"
    t.string "trial_interval_type"
    t.string "trial_interval_count"
    t.string "trial_adjustment_type"
    t.string "trial_adjustment_value"
    t.json "product_images"
    t.string "mystery_duration"
    t.string "mystery_duration_value"
    t.string "delivery_interval_type"
    t.integer "delivery_interval_count"
    t.integer "box_subscription_type"
    t.boolean "box_is_quantity"
    t.boolean "box_is_quantity_limited"
    t.integer "box_quantity_limit"
    t.json "collection_images"
    t.text "billing_dates", default: [], array: true
    t.text "shipping_dates", default: [], array: true
  end

  create_table "settings", force: :cascade do |t|
    t.integer "shop_id"
    t.integer "payment_retries"
    t.integer "payment_delay_retries"
    t.boolean "cancel_enabled"
    t.boolean "pause_resume"
    t.boolean "attempt_billing"
    t.boolean "skip_payment"
    t.boolean "show_after_checkout"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "email_after_checkout"
    t.string "themes"
    t.text "style_header"
    t.text "style_footer"
    t.text "style_credit_card"
    t.string "navigation_delivery"
    t.string "shiping_address"
    t.string "upcoming_oder_date"
    t.string "product_to_subscription"
    t.string "change_variant"
    t.string "swap_product"
    t.string "shipment"
    t.string "frequency"
    t.string "facing_frequency_option"
    t.string "one_time_purchase"
    t.string "available_purchase"
    t.string "discount"
    t.string "subscription_cancellation"
    t.string "cancellation_email_contact"
    t.string "allow_cancel_after"
    t.string "reactive_subscription"
    t.string "upcoming_quantity"
    t.boolean "activate_dunning_for_cards"
    t.string "dunning_period"
    t.string "retry_frequency"
    t.string "happens_to_subscriptions"
    t.string "happens_to_invoices"
    t.boolean "dunning_future_trial_subscriptions"
    t.boolean "dunning_one_time_invoice"
    t.boolean "activate_dunning_direct_debit"
    t.string "direct_debit_subscription"
    t.string "direct_debit_invoice"
    t.boolean "dunning_offline_configure"
    t.string "dunning_offline_peiod"
    t.string "dunning_offline_subscription"
    t.string "dunning_offline_invoice"
    t.boolean "dunning_card_configure"
    t.boolean "additional_send_account_after_checkout"
    t.boolean "bbc_storeowner"
    t.boolean "cc_storeowner"
    t.boolean "send_shopify_receipt"
    t.boolean "send_fullfillment"
    t.string "choose_automatic_retry_mode"
    t.string "store_name"
    t.string "store_email"
    t.string "storefront_password"
    t.text "checkout_subscription_terms"
    t.text "email_subscription_terms"
    t.text "apple_pay_subscription_terms"
    t.text "style_account_profile"
    t.text "style_sidebar"
    t.text "style_subscription"
    t.text "style_sidebar_pages"
    t.text "style_upsell"
    t.boolean "show_promo_button", default: true
    t.string "promo_button_content"
    t.string "promo_button_url"
    t.string "contact_box_content"
    t.string "promo_tagline1_content"
    t.string "promo_tagline2_content"
    t.boolean "show_subscription", default: true
    t.boolean "show_delivery_schedule", default: true
    t.boolean "show_order_history", default: true
    t.boolean "show_address", default: true
    t.boolean "show_billing", default: true
    t.boolean "show_account", default: true
    t.string "delay_order"
    t.string "pause_subscription"
    t.string "email_service"
    t.integer "design_type", default: 0
    t.index ["shop_id"], name: "index_settings_on_shop_id", unique: true
  end

  create_table "shops", force: :cascade do |t|
    t.string "shopify_domain", null: false
    t.string "shopify_token", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "phone"
    t.string "recurring_charge_id"
    t.string "recurring_charge_status"
    t.string "charge_confirmation_link"
    t.index ["shopify_domain"], name: "index_shops_on_shopify_domain", unique: true
  end

  create_table "smarty_cancellation_reasons", force: :cascade do |t|
    t.string "name"
    t.integer "winback", default: 0
    t.bigint "shop_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shop_id"], name: "index_smarty_cancellation_reasons_on_shop_id"
  end

  create_table "smarty_messages", force: :cascade do |t|
    t.bigint "shop_id"
    t.string "title"
    t.text "description"
    t.text "body"
    t.boolean "custom", default: false
    t.integer "usage_count", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shop_id"], name: "index_smarty_messages_on_shop_id"
  end

  create_table "smarty_variables", force: :cascade do |t|
    t.bigint "shop_id"
    t.string "name"
    t.text "response"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["shop_id"], name: "index_smarty_variables_on_shop_id"
  end

  create_table "sms_conversations", force: :cascade do |t|
    t.bigint "customer_id"
    t.integer "status", default: 0
    t.datetime "last_activity_at"
    t.string "command"
    t.integer "command_step", default: 0
    t.json "command_data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_sms_conversations_on_customer_id"
  end

  create_table "sms_logs", force: :cascade do |t|
    t.bigint "shop_id"
    t.bigint "customer_id"
    t.integer "action", default: 0
    t.decimal "revenue", precision: 5, scale: 2
    t.string "product_id"
    t.string "swaped_product_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_sms_logs_on_customer_id"
    t.index ["shop_id"], name: "index_sms_logs_on_shop_id"
  end

  create_table "sms_messages", force: :cascade do |t|
    t.bigint "sms_conversation_id"
    t.string "from_number"
    t.string "to_number"
    t.boolean "comes_from_customer"
    t.text "content"
    t.string "command"
    t.integer "command_step", default: 0
    t.json "command_data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["sms_conversation_id"], name: "index_sms_messages_on_sms_conversation_id"
  end

  create_table "sms_settings", force: :cascade do |t|
    t.bigint "shop_id"
    t.integer "status", default: 0
    t.boolean "delay_order", default: false
    t.boolean "order_tracking", default: false
    t.boolean "renewal_reminder", default: false
    t.boolean "skip_update_next_charge", default: false
    t.boolean "one_time_upsells", default: false
    t.boolean "cancel_reactivate_subscription", default: false
    t.boolean "edit_quantity", default: false
    t.boolean "cancel_subscription", default: false
    t.boolean "winback_flow", default: false
    t.time "delivery_start_time"
    t.time "delivery_end_time"
    t.string "renewal_duration"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "failed_renewal"
    t.boolean "opt_in", default: false
    t.boolean "swap_product", default: false
    t.boolean "update_billing", default: false
    t.index ["shop_id"], name: "index_sms_settings_on_shop_id"
  end

  create_table "subscription_contracts", force: :cascade do |t|
    t.string "shopify_id"
    t.string "first_name"
    t.string "last_name"
    t.string "customer_shopify_id"
    t.string "shipment_status"
    t.date "order_date"
    t.string "tracking_url"
    t.string "product"
    t.decimal "total"
    t.integer "shop_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "shopify_created_at"
    t.datetime "cancelled_at"
    t.string "status"
  end

  create_table "subscription_logs", force: :cascade do |t|
    t.integer "billing_status", default: 0
    t.integer "action_type", default: 0
    t.string "subscription_id"
    t.bigint "shop_id"
    t.bigint "customer_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "executions", default: false
    t.decimal "revenue", precision: 5, scale: 2
    t.string "product_id"
    t.string "swaped_product_id"
    t.string "description"
    t.integer "log_type", default: 0
    t.string "amount"
    t.string "product_name"
    t.string "note"
    t.index ["customer_id"], name: "index_subscription_logs_on_customer_id"
    t.index ["shop_id"], name: "index_subscription_logs_on_shop_id"
  end

  create_table "translations", force: :cascade do |t|
    t.bigint "shop_id"
    t.string "sidebar_subscription"
    t.string "sidebar_active"
    t.string "sidebar_cancelled"
    t.string "sidebar_delivery_schedule"
    t.string "sidebar_order_history"
    t.string "sidebar_addresses"
    t.string "sidebar_billing"
    t.string "sidebar_account"
    t.string "home_tab_active_subscriptions"
    t.string "home_tab_no_subscriptions_found"
    t.string "home_tab_quantity"
    t.string "home_tab_edt_button"
    t.string "home_tab_delay_next_order_btn"
    t.string "home_tab_delivery_schedule_btn"
    t.string "home_tab_edit_subscription_btn"
    t.string "home_tab_delivery_address"
    t.string "home_tab_edit_btn"
    t.string "home_tab_recommended_for_you"
    t.string "home_tab_add_subscription"
    t.string "home_tab_apply_discount"
    t.string "home_tab_start_date"
    t.string "home_tab_est_next_delivery"
    t.string "home_tab_last_card_charge"
    t.string "upsell_title"
    t.string "upsell_time_left"
    t.string "upsell_product_variants"
    t.string "upsell_pay_now"
    t.string "upsell_no_thanks"
    t.string "upsell_search_for_product"
    t.string "upsell_search"
    t.string "upsell_clear"
    t.string "delay_popup_choose_date"
    t.string "delay_popup_delay_two_weeks"
    t.string "delay_popup_delay_one_month"
    t.string "delay_popup_delay_two_month"
    t.string "delay_popup_delay_three_month"
    t.string "delay_popup_back"
    t.string "delay_popup_apply"
    t.string "delivery_schedule_popup_next_order"
    t.string "delivery_schedule_popup_order_product"
    t.string "delivery_schedule_popup_order_address"
    t.string "delivery_schedule_popup_scheduled_orders"
    t.string "delivery_schedule_popup_skip"
    t.string "delivery_schedule_popup_back"
    t.string "delivery_schedule_popup_apply"
    t.string "edit_subscription_popup_est_next_delivery"
    t.string "edit_subscription_popup_next_card_charge"
    t.string "edit_subscription_popup_upgrade_subscription"
    t.string "edit_subscription_popup_swap_subscription"
    t.string "edit_subscription_popup_ask_a_question"
    t.string "edit_subscription_popup_cancel_subscription"
    t.string "swap_subscription_popup_swap_subscription_to"
    t.string "swap_subscription_popup_swap_subscription_button"
    t.string "upgrade_subscription_popup_swap_subscription_to"
    t.string "upgrade_subscription_popup_upgrade_subscription_btn"
    t.string "cancelled_tab_cancelled_subscriptions"
    t.string "cancelled_tab_reactivate_btn"
    t.string "cancelled_tab_start_date"
    t.string "cancelled_tab_quantity"
    t.string "cancelled_loyalty_cancel_subscription"
    t.string "cancelled_loyalty_get_reward"
    t.string "cancelled_loyalty_cancel_anyway"
    t.string "cancelled_loyalty_keep_points"
    t.string "cancelled_no_loyalty_cancel_anyway"
    t.string "cancelled_no_loyalty_keep_subscription"
    t.string "cancelled_reasons_cancel_subscription"
    t.string "cancelled_reasons_keep_subscription"
    t.string "cancelled_reasons_cancel"
    t.string "delivery_tab_my_next_order"
    t.string "delivery_tab_my_scheduled_order"
    t.string "delivery_tab_no_subscriptions_found"
    t.string "delivery_tab_est_delivery"
    t.string "delivery_tab_order_product"
    t.string "delivery_tab_order_address"
    t.string "delivery_tab_skip"
    t.string "order_history_tab_my_order_history"
    t.string "order_history_tab_order_no"
    t.string "order_history_tab_no_subscriptions"
    t.string "order_history_tab_date"
    t.string "order_history_tab_amount"
    t.string "order_history_tab_view"
    t.string "order_history_tab_invoice"
    t.string "address_tab_my_address"
    t.text "address_tab_no_subscriptions_found"
    t.string "address_tab_edit"
    t.string "address_tab_phone"
    t.string "address_tab_company"
    t.string "address_tab_address"
    t.string "address_tab_add_address"
    t.string "add_address_popup_first_name"
    t.string "add_address_popup_last_name"
    t.string "add_address_popup_address1"
    t.string "add_address_popup_address2"
    t.string "add_address_popup_company"
    t.string "add_address_popup_city"
    t.string "add_address_popup_country"
    t.string "add_address_popup_zip"
    t.string "add_address_popup_state"
    t.string "add_address_popup_phone"
    t.string "add_address_popup_update"
    t.string "billing_tab_billing_information"
    t.text "billing_tab_billing_no_subscriptions_found"
    t.string "billing_tab_card_on_file"
    t.string "billing_tab_update"
    t.string "billing_tab_edit"
    t.string "billing_tab_phone"
    t.string "billing_tab_company"
    t.string "billing_tab_address"
    t.string "update_payment_popup_card_name"
    t.string "update_payment_popup_card_number"
    t.string "update_payment_popup_exp_month"
    t.string "update_payment_popup_exp_date"
    t.string "update_payment_popup_cvv"
    t.string "update_payment_popup_update_card"
    t.string "account_tab_my_account_detail"
    t.text "account_tab_no_subscriptions_found"
    t.string "account_tab_first_name"
    t.string "account_tab_last_name"
    t.string "account_tab_email"
    t.string "account_tab_save_button"
    t.string "delay_shipment_popup_title"
    t.string "delay_shipment_popup_back"
    t.string "delay_shipment_popup_apply"
    t.index ["shop_id"], name: "index_translations_on_shop_id"
  end

  create_table "upsell_campaign_groups", force: :cascade do |t|
    t.string "internal_name"
    t.string "selector_title"
    t.string "public_name"
    t.integer "status"
    t.integer "shop_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "upsell_location"
  end

  create_table "upsell_campaigns", force: :cascade do |t|
    t.string "name"
    t.string "selector_label"
    t.text "description"
    t.integer "interval_type"
    t.integer "interval_count"
    t.boolean "rule_cart", default: false
    t.integer "rule_cart_condition"
    t.boolean "rule_customer", default: false
    t.integer "rule_customer_condition"
    t.boolean "rule_order", default: false
    t.integer "rule_order_condition"
    t.string "rule_order_value"
    t.boolean "rule_product", default: false
    t.integer "rule_product_condition"
    t.string "rule_product_value"
    t.boolean "product_display_quantity"
    t.boolean "product_limit_quantity"
    t.integer "product_quantity_value"
    t.integer "template"
    t.boolean "show_offer_title"
    t.string "offer_title"
    t.boolean "show_timer"
    t.string "background_color"
    t.integer "button_position"
    t.string "button_text_accept"
    t.string "button_text_decline"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "upsell_campaign_group_id"
    t.json "rule_cart_value"
    t.json "product_offer"
    t.json "rule_customer_value"
    t.json "checkout_products"
  end

  add_foreign_key "customers", "reasons_cancels"
end
