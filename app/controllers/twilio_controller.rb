class TwilioController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def sms
    TwilioServices::SmsCallback.call(params)
    render status: 200, json: { success: true }
  end
end
