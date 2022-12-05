require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :users
  resources :ways_to_earn_points
  mount Sidekiq::Web => "/#{ENV['SIDEKIQ_SECRET']}"
  mount PgHero::Engine, at: "/chargezen_pghero"

  resources :bundles, only: [:destroy]
  resources :bundle_groups
  resources :sms_flows do 
    collection do
      post :update_smart_message_status
    end
  end
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "graphql#execute"
  end

  post "/graphql", to: "graphql#execute"
  post "/graphql-shopify", to: "graphql_shopify#execute"
  get '/subscription_products', to: 'products#subscription_products'
  post '/subscriptions/update_next_billing_date', to: 'subscriptions#update_billing_date'

  mount ShopifyApp::Engine, at: '/'
  root :to => 'home#index'

  post '/shop/redact', to: 'gdpr_webhooks#shop_redact'
  post '/customers/redact', to: 'gdpr_webhooks#customer_redact'
  post '/customers/data_request', to: 'gdpr_webhooks#customer_data_request'

  post '/shopify_webhooks/app_uninstalled', to: 'shopify_webhooks#app_uninstalled'
  post '/shopify_webhooks/order_create', to: 'shopify_webhooks#order_create'
  post '/shopify_webhooks/order_cancelled', to: 'shopify_webhooks#order_cancelled'
  post '/shopify_webhooks/order_fulfilled', to: 'shopify_webhooks#order_fulfilled'
  post '/shopify_webhooks/order_updated', to: 'shopify_webhooks#order_updated'
  post '/shopify_webhooks/subscription_contract_create', to: 'shopify_webhooks#subscription_contract_create'
  post '/shopify_webhooks/subscription_contract_update', to: 'shopify_webhooks#subscription_contract_update'
  post '/shopify_webhooks/billing_attempt_success', to: 'shopify_webhooks#billing_attempt_success'
  post '/shopify_webhooks/customer_create', to: 'shopify_webhooks#customer_create'
  post '/shopify_webhooks/customer_update', to: 'shopify_webhooks#customer_update'
  post '/webhooks/stripe/subscription', to: 'stripe_webhooks#subscription'
  post '/shopify_webhooks/customer_payment_method_create', to: 'shopify_webhooks#customer_payment_method_create'
  post '/shopify_webhooks/customer_payment_method_update', to: 'shopify_webhooks#customer_payment_method_update'
  post '/shopify_webhooks/customer_payment_method_revoke', to: 'shopify_webhooks#customer_payment_method_revoke'
  post '/shopify_webhooks/bulk_operation_finish', to: 'shopify_webhooks#bulk_operation_finish'  

  post '/shipping_suites/sync_orders', to: 'shipping_suites#sync_orders'

  resources :power_plans, only: [] do
    member do
      post :pause
      post :cancel
      post :swap
    end
  end

  namespace :app_proxy do
    resources :account do
      collection do
        get :personal
        get :shipping
        get :password

        post :update_info
        post :update_address
      end
    end
    resources :orders
    resources :build_a_box, only: :index do
      collection do
        post :add_product
        get :get_build_a_box
      end
    end
    resources :bundles do
      collection do
        get :get_bundle
      end
    end
    resources :selling_plans, only: [] do
      collection do
        get :plan_type
      end
    end
    resources :subscriptions do
      collection do
        get :skip_next_billing_date
      end
      member do
        post :pause
        post :cancel
        post :resume
        post :change_bill
        post :change_frequency
        post :change_quantity
        post :change_date
        post :update_subscription
        post :add_product
        post :update_quantity
        post :apply_discount
        post :update_shiping_detail
        post :swap_product
        post :upgrade_product
        post :remove_line
        post :skip_schedule
        post :update_payment
      end
    end
    resources :dashboard, only: [:index] do
      collection do
        get :subscription
        get :upcoming
        get :order_history
        get :addresses
        get :payment_methods
        get :settings
        get :build_a_box
        post :confirm_box_selection
        get :track_order
        post :update_stripe_source
        post :pre_order
        get :get_delivery_option
        get :submit_delivery_option
        post :customer_info
        put :update_theme
        post :create_pre_order
        get :fetch_contract
        get :update_delivery_day
        post :portal_skip_schedule
        get :show_order
        get :order_paginate
        post :add_meals 
        get :get_subscription_payment
      end
    end

    get "/passwordlesslogin",to: "password_less_login#index"
    resources :password_less_login, only: [] do
      collection do
        post :send_otp_passwordless_login
        post :auth_with_otp
        delete :log_out
      end
    end
    root 'dashboard#index'
  end

  resources :script_tags do
    collection do
      get :subscriptions
    end
  end

  post "/graphql_extension", to: "extension#execute"

  resources :subscriptions do
    collection do
      post :update_subscription
      post :update_customer
      get :sync_stripe
      post :create_billing_attempt
      post :update_contract_delivery_date_day 
      get :skip_next_billing_date
      post :customer_migration
      get :fetch_customers_from_shopify
      post :import_customer_migrations
    end

    member do
      get :send_update_card
      get :remove_card
      get :skip_schedule
      post :resume
      post :add_product
      post :update_quantity
      post :swap_product
      post :upgrade_product
      post :remove_line
      post :skip_schedule
      post :pause
      post :cancel
      post :remove_box_item
    end
  end

  resources :debug_mode, only: [:index, :create]

  resources :settings do
    collection do
      get :stripe_settings
      post :update_stripe_settings
      post :delivery_options
      get  :delivery_options, to: 'settings#get_delivery_option'
    end
  end

  resources :select_plan, only: [:index, :create]

  resources :email_images, only: [] do
    collection do 
      post :upload_email_image
    end
  end

  resources :user_shops, only: [] do
    collection do
      post :authorize_user_shop
      post :create_user_shop_child
    end
  end
  
  get "/ssoLogin",to: "user_shop_password_less_login#index"
  resources :user_shop_password_less_login, only: [] do
    collection do
      post :send_otp_passwordless_login
      post :auth_with_otp
      delete :log_out
    end
  end

  post '/changeShop', to: 'user_shops#change_shop'

  get 'subscription/charge', to: 'callback#charge'

  resources :zip_codes, only: [:index, :create]
  delete 'zip_codes', to: 'zip_codes#destroy'

  get '*path' => 'home#index'
  post 'twilio/sms', 'twilio#sms'

end
