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

ActiveRecord::Schema.define(version: 2021_05_28_111450) do

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
    t.string "build_a_box_min_number"
    t.string "build_a_box_max_number"
    t.string "build_a_box_duration"
    t.string "build_a_box_duration_value"
    t.string "mystery_duration"
    t.string "mystery_duration_value"
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
    t.index ["shop_id"], name: "index_settings_on_shop_id", unique: true
  end

  create_table "shops", force: :cascade do |t|
    t.string "shopify_domain", null: false
    t.string "shopify_token", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "phone"
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
    t.boolean "failed_renewal", default: false
    t.boolean "cancel_reactivate_subscription", default: false
    t.boolean "edit_quantity", default: false
    t.boolean "cancel_subscription", default: false
    t.boolean "winback_flow", default: false
    t.time "delivery_start_time"
    t.time "delivery_end_time"
    t.string "renewal_duration"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.index ["customer_id"], name: "index_subscription_logs_on_customer_id"
    t.index ["shop_id"], name: "index_subscription_logs_on_shop_id"
  end

  create_table "upsell_campaign_groups", force: :cascade do |t|
    t.string "internal_name"
    t.string "selector_title"
    t.string "public_name"
    t.integer "status"
    t.integer "shop_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
  end

  add_foreign_key "customers", "reasons_cancels"
end
