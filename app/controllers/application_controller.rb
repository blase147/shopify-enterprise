class ApplicationController < ActionController::Base
  before_action :set_hmac

  def set_hmac
    session[:hmac] ||= params[:hmac]
    session[:shop] ||= params[:shop]
    session[:session] ||= params[:session]
  end
end
