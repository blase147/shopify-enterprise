Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "graphql#execute"
  end

  post "/graphql", to: "graphql#execute"
  post "/graphql-shopify", to: "graphql_shopify#execute"

  mount ShopifyApp::Engine, at: '/'
  root :to => 'home#index'

  post '/shop/redact', to: 'gdpr_webhooks#shop_redact'
  post '/customers/redact', to: 'gdpr_webhooks#customer_redact'
  post '/customers/data_request', to: 'gdpr_webhooks#customer_data_request'

  post '/shopify_webhooks/app_uninstalled', to: 'shopify_webhooks#app_uninstalled'

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
    resources :selling_plans, only: [] do
      collection do
        get :plan_type
      end
    end
    resources :subscriptions do
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
      post :remove_box_item
    end
  end

  resources :select_plan, only: [:index, :create]

  get 'subscription/charge', to: 'callback#charge'
  get '*path' => 'home#index'
  post 'twilio/sms', 'twilio#sms'
end
