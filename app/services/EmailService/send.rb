class EmailService::Send < ApplicationService
  
  def initialize(email_notification)
    @email_notification = email_notification
  end

  def send_email(object)
    if @email_notification.present?
      email_service = @email_notification.setting.email_service
      case email_service.downcase
      when "klaviyo"
        EmailService::Klaviyo.new(@email_notification).send_email(object)
      when "sendgrid"
        EmailService::Sendgrid.new(@email_notification).send_email(object)
      else
        false
      end
    else
      false
    end
  end

end
