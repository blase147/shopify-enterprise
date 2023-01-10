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
      if current_user.present?
        @all_shops = ShopUser.where(user_id: current_user.id).order(created_at: :asc)&.joins(:shop).pluck(:shopify_domain) rescue nil
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
        if session[:shop_domain].present?
          @shopify_domain ||= session[:shop_domain]
        else
          @shopify_domain ||= ShopUser.where(user_id: current_user.id).order(created_at: :asc).first.shop.shopify_domain
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

end
