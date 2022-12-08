class ApplicationController < ActionController::Base
  before_action :set_hmac

  before_action :verify_user
  helper_method :current_setting

  before_action :configure_permitted_parameters, if: :devise_controller?

  def current_setting
    return @current_setting if @current_setting&.present?
    @current_setting = current_shop.setting

    if @current_setting&.nil?
      @current_setting = current_shop.create_setting( payment_retries: 3,
                                                      payment_delay_retries: 1,
                                                      cancel_enabled: true,
                                                      pause_resume: true,
                                                      attempt_billing: false,
                                                      skip_payment: true,
                                                      show_after_checkout: false,
                                                      email_after_checkout: true,
                                                      max_fail_strategy: 'skip',
                                                      account_portal_option: 'add_link',
                                                      active_subscription_btn_seq: ['update_choices', 'delivery_schedule', 'swap_subscription', 'delay_next_order', 'edit_subscription'] )
    end

    @current_setting
  end

  def set_hmac
    session[:hmac] ||= params[:hmac]
    session[:shop] ||= params[:shop]
    session[:session] ||= params[:session]
  end

  def generate_admin_token
    auth_token = SecureRandom.urlsafe_base64(nil, false)
    redis = Redis.new
    redis.set("admin_auth_token", auth_token, options = {ex: 1800})
    return auth_token
  end

  helper_method :generate_admin_token

  def verify_user
    # redirect_to new_user_session_path unless current_user.present?
  end

  def after_sign_in_path_for(resource)
    user_shop = UserShop.find_or_create_by( user_id: current_user.id)
    #register user on mixpanel
    "/admin/id"
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) { |u| u.permit(:email, :password, :password_confirmation,:first_name, :last_name)}
    devise_parameter_sanitizer.permit(:account_update) { |u| u.permit(:role, :email, :password, :current_password,:first_name, :last_name)}
  end
end
