class AccountActivationEmailWorker
  include Sidekiq::Worker

  def perform(customer_id)
    csc = CustomerSubscriptionContract.find_by(shopify_customer_id: customer_id)
    shop = csc.shop
    shop.connect
    activation_url = GenerateAccountActivationUrl.new(customer_id).generate
    if activation_url.present?
      response = SendEmailService.new.send_account_activation_url_email(csc, activation_url)
      if response[:status]
        SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: response[:email_body])
      else
        SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {email_body: response[:email_body], id: csc.id, emaill: csc.email, shopify_id: csc.shopify_customer_id })
      end
    end
  rescue => e
    params = {customer_id: customer_id}
    message = "#{e.message} from #{e.backtrace.first}"
    SiteLog.create(log_type: SiteLog::TYPES[:sidekiq_job_failure], message: message, params: params)
  end
end
