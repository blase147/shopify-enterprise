class TwilioController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def sms
    TwilioServices::SmsCallback.call(params)
    render status: 200, xml: { success: true }.to_xml
  end
end
