# frozen_string_literal: true

class HomeController < ApplicationController 
  before_action :redirection
  before_action :install_shop
  def index
      unless session[:shop_id] # ensure cookie session as well
        session[:shop_id] = Shop.find_by(shopify_domain: current_shopify_domain)&.id
      end
      #if ENV['APP_TYPE'] == 'public' && current_shop.recurring_charge_id.blank?
       # redirect_to select_plan_index_path
      #else
        @shop_origin = current_shopify_domain
        @enable_password = current_shop&.setting&.enable_password
        @all_shops = (current_user&.user_shop&.shops.map{|shop| shop&.shopify_domain} || [] ) if current_user&.user_shop&.shops.present?
     # end
  end

  private

  def current_shop
    if session[:shop_domain].present?
      @current_shop = Shop.find_by(shopify_domain: session[:shop_domain])
    else
      @current_shop ||= Shop.find_by(shopify_domain: current_shopify_domain)
    end
  end

  def current_shopify_domain
    current_shopify_domain ||= (current_user.user_shop&.shops&.first&.shopify_domain if current_user.present?)
  end

  def install_shop
    if current_user.present? && params[:shop].present?
      shop = Shop.find_by_shopify_domain(params[:shop])
      shop&.update(user_shop_id: current_user&.user_shop&.id) 
    end
  end

  def redirection
    shop = Shop.all
    user = UserShop.all
    unless current_user.present? || request.url.to_s.include?("/ssoLogin")
        if shop.present? && !user.present? && !request.url.to_s.include?("/users/sign_up")
          redirect_to "/users/sign_up" 
        elsif shop.present? && user.present? && !request.url.to_s.include?("/users/sign_in")
          redirect_to "/users/sign_in"
        else
          redirect_to "/users/sign_up" unless request.url.to_s.include?("/users/sign_up")
        end
    end
  end

end
