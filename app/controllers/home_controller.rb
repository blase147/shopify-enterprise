# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :check_shop_known 
  before_action :check_shopify_backend, only: [:index]
  before_action :redirection

  def index
    unless session[:shop_id] # ensure cookie session as well
      session[:shop_id] = Shop.find_by(shopify_domain: current_shopify_domain)&.id
    end
    #if ENV['APP_TYPE'] == 'public' && current_shop.recurring_charge_id.blank?
     # redirect_to select_plan_index_path
    #else
      @shop_origin = current_shopify_domain
      @enable_password = current_shop&.setting&.enable_password
      if current_user.present?
          from_shop = ShopifyAPI::Shop.current rescue nil
          if from_shop.present?
            @all_shops = [from_shop.domain]
          else
            @all_shops = current_user.user_shops.order(created_at: :asc).joins(:shop).pluck(:shopify_domain) rescue []
          end
      end
    # end
  end

  private

  def current_shopify_domain
    if params[:shop].present? && params[:hmac].present?
      @shopify_domain ||= ShopifyApp::Utils.sanitize_shop_domain(params[:shop])
      redirect_to(ShopifyApp.configuration.login_url) unless @shopify_domain
    else
      if current_user.present?
        from_shop = ShopifyAPI::Shop.current rescue nil
        if from_shop.present?
          @shopify_domain ||= from_shop.domain
        elsif session[:shop_domain].present?
          @shopify_domain ||= session[:shop_domain]
        else
          @shopify_domain ||= current_user.user_shops.order(created_at: :asc).joins(:shop).first.shop.shopify_domain rescue nil
        end
      end
    end
  end

  def current_shop
      @current_shop ||= Shop.find_by(shopify_domain: current_shopify_domain)
  end

  def redirection
      shop = Shop.all
      user = UserShop.all
      unless current_user.present? || request.url.to_s.include?("/ssoLogin") || request.url.to_s.include?("/authenticateAdmin") || params[:hmac].present?
        if shop.present? && !user.present? && !request.url.to_s.include?("/users/sign_up")
          redirect_to "/users/sign_up" 
        elsif shop.present? && user.present? && !request.url.to_s.include?("/users/sign_in")
          redirect_to "/users/sign_in"
        else
          redirect_to "/users/sign_up" unless request.url.to_s.include?("/users/sign_up")
        end
    end
  end

  #Require Known Shop
  def check_shop_known
    @shopify_domain ||= ShopifyApp::Utils.sanitize_shop_domain(params[:shop])
    if @shopify_domain.present?
      @shop = current_shopify_domain
      redirect_to(shop_login) unless @shop
    end
  end

  def shop_login
    url = URI(ShopifyApp.configuration.login_url)

    url.query = URI.encode_www_form(
      shop: params[:shop],
      return_to: request.fullpath,
    )

    url.to_s
  end

  def current_shop
    @current_shop ||= Shop.find_by(shopify_domain: current_shopify_domain)
  end

  ### Check if user is trying to access the app from shopify_backend ###
  def check_shopify_backend
    from_shop = ShopifyAPI::Shop.current rescue nil
    if from_shop.present?
      admin = User.find_by_email(from_shop.customer_email.strip)
      token = SecureRandom.urlsafe_base64(nil, false)
      shop = Shop.find_by_shopify_domain(from_shop.domain)
      
      admin.user_shops.find_by_shop_id(shop.id)&.update(sign_out_after: (Time.current + 30.minutes))
      sign_in(admin)
    else
      log_out_admin
    end
  end

  ### Check if admin logged in time exceeds it will log_out ###
  def log_out_admin
    shop = Shop.find_by_shopify_domain(current_shop.shopify_domain) rescue nil
    user_shop = current_user.user_shops.find_by_shop_id(shop.id) rescue nil
    logged = Time.current > user_shop&.sign_out_after rescue true
    if user_shop&.role == "admin" && logged
      user_shop.update(sign_out_after: nil)
      sign_out(current_user)
      redirect_to "/users/sign_in"
    end
  end

end
