# send_sms.rb
class TwilioServices::SendSms < ApplicationService
  def initialize(params)
    @params = params
  end

  def call
    Rails.logger.info("Sending SMS to #{@params[:to]}: #{@params[:message]}")
    send_message
  end

  def send_message
    shop = Shop.find_by_phone(@params[:from])
    message = @params[:message]
    { message: message, error_message: nil }
  rescue Twilio::REST::RestError => e
    Rails.logger.info("Error from Twilio: #{e.error_message}")
    { error_message: e.error_message }
  end

  def twilio_client(shop)
    integration = shop.integrations.find_by_name('Twilio')
    @twilio_client = Twilio::REST::Client.new(integration.credentials['twilio_account_sid'], integration.credentials['twilio_auth_token'])
  end
end
