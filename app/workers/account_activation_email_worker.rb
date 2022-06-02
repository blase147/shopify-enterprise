class AccountActivationEmailWorker
  include Sidekiq::Worker

  def perform(customer_id)
    csc = CustomerSubscriptionContract.find_by(shopify_customer_id: customer_id)
    shop = csc.shop
    shop.connect
    activation_url = GenerateAccountActivationUrl.new(customer_id).generate
    if activation_url.present?
      @email_notification = shop.setting.email_notifications.find_by_name "Subscription Activation"
      email_body = "Hi #{csc.name} you’ve created a new customer account at Ethey: Canada’s #1 meal delivery service.. All you have to do is activate it.

      Here's your activation URL #{activation_url}"
      customer_object = {customer: csc, email_body: email_body}
      if EmailService::Send.new(@email_notification).send_email(customer_object)
        SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: email_body)
      else
        SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {email_body: email_body, id: csc.id, emaill: csc.email, shopify_id: csc.shopify_customer_id })
      end
    end
  rescue => e
    params = {customer_id: customer_id}
    message = "#{e.message} from #{e.backtrace.first}"
    SiteLog.create(log_type: SiteLog::TYPES[:sidekiq_job_failure], message: message, params: params)
  end
end
