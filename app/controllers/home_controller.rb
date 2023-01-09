# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :check_shop_known 
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
      if current_user.user_shop_child.present?
        user_shop = UserShop.find(current_user.user_shop_child.user_shop_id)
        @all_shops = (user_shop&.shops.map{|shop| shop&.shopify_domain} || [] )
      else
        install_shop
        @all_shops = (current_user&.user_shop&.shops.map{|shop| shop&.shopify_domain} || [] ) if current_user&.user_shop&.shops.present?
      end
    # end
  end

  private

  def current_shopify_domain
    if params[:shop].present? && params[:hmac].present?
      @shopify_domain ||= ShopifyApp::Utils.sanitize_shop_domain(params[:shop])
      redirect_to(ShopifyApp.configuration.login_url) unless @shopify_domain
    else
      if current_user.user_shop_child.present?
        user_shop = UserShop.find(current_user.user_shop_child.user_shop_id)
        @shopify_domain ||= (user_shop&.shops&.first&.shopify_domain if current_user.present?)
      else
        @shopify_domain ||= (current_user.user_shop&.shops&.first&.shopify_domain if current_user.present?)
      end
    end
  end

  def current_shop
    if session[:shop_domain].present?
      @current_shop = Shop.find_by(shopify_domain: session[:shop_domain])
    else
      @current_shop ||= Shop.find_by(shopify_domain: current_shopify_domain)
    end
  end

  def install_shop
    if current_user.present? && params[:shop].present? || params[:hmac].nil?
      shop = Shop.find_by_shopify_domain(params[:shop]) rescue nil
      shop&.update(user_shop_id: current_user&.user_shop&.id) 
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

end
