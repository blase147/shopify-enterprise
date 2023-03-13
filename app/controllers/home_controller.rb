# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :check_shop_known 
  before_action :log_out_admin
  before_action :redirection

  def index
    unless session[:shop_id] # ensure cookie session as well
      session[:shop_id] = Shop.find_by(shopify_domain: current_shopify_domain)&.id
    end
    if ENV['APP_TYPE'] == 'public' && current_shop.recurring_charge_id.blank?
       redirect_to select_plan_index_path({shop: current_shop.shopify_domain})
    else
      @shop_origin = current_shopify_domain
      @enable_password = current_shop&.setting&.enable_password
      if current_user.present?
        @all_shops = current_user.user_shops.order(created_at: :asc).joins(:shop).pluck(:shopify_domain) rescue []
      end
     end
  end

  private

  def current_shopify_domain
    if params[:shop].present? && params[:hmac].present?
      @shopify_domain ||= ShopifyApp::Utils.sanitize_shop_domain(params[:shop])
      redirect_to(ShopifyApp.configuration.login_url) unless @shopify_domain
    else
      if params[:shopify_domain].present?
        shop = current_user.user_shops.joins(:shop).where("shops.shopify_domain = '#{params[:shopify_domain]}.myshopify.com' OR shops.shopify_domain = '#{params[:shopify_domain]}'")&.first&.shop
        current_shop = shop
        @shopify_domain = shop&.shopify_domain
      elsif current_user.present?
        from_shop = ShopifyAPI::Shop.current rescue nil
        if from_shop.present?
          @shopify_domain = from_shop.myshopify_domain
        elsif session[:shopify_domain].present?
          @shopify_domain = session[:shopify_domain]
        else
          @shopify_domain ||= current_user.user_shops.order(created_at: :asc).joins(:shop).pluck(:shopify_domain).first rescue nil
        end
      end
    end
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
    @current_shop&.connect
    @current_shop
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
