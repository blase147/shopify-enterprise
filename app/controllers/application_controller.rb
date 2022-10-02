class ApplicationController < ActionController::Base
  before_action :set_hmac
  helper_method :current_setting

  def current_setting
    @current_setting ||= current_shop.setting || current_shop.create_setting(
      payment_retries: 3,
      payment_delay_retries: 1,
      cancel_enabled: true,
      pause_resume: true,
      attempt_billing: false,
      skip_payment: true,
      show_after_checkout: false,
      email_after_checkout: true,
      max_fail_strategy: 'skip',
      account_portal_option: 'add_link',
      active_subscription_btn_seq: %w(update_choices
                                      delivery_schedule
                                      swap_subscription
                                      delay_next_order
                                      edit_subscription)
    )
  end

  def set_hmac
    session[:hmac] ||= params[:hmac]
    session[:shop] ||= params[:shop]
    session[:session] ||= params[:session]
  end
end
