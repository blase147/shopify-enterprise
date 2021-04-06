Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "graphql#execute"
  end

  post "/graphql", to: "graphql#execute"
  post "/graphql-shopify", to: "graphql_shopify#execute"

  mount ShopifyApp::Engine, at: '/'
  root :to => 'home#index'

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
        post :remove_line
        post :skip_schedule
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
    end
  end

  get '*path' => 'home#index'
end
