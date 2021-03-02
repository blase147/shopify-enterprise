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

  get '*path' => 'home#index'
end
