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
    message = twilio_client.messages.create(
      from: ENV['TWILIO_PHONE_NUMBER'],
      to: @params[:to],
      body: @params[:message]
    )
    { message: message, error_message: nil }
  rescue Twilio::REST::RestError => e
    Rails.logger.info("Error from Twilio: #{e.error_message}")
    { error_message: e.error_message }
  end

  def twilio_client
    @twilio_client = Twilio::REST::Client.new ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN']
  end
end
