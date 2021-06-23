class GdprWebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token
  include ShopifyApp::WebhookVerification

  def shop_redact
    params.permit!
    shop = Shop.where(shop_domain: params['shop_domain'])
    if shop.present?
      shop.destroy
    end
    head :no_content
  end

  def customer_redact
    params.permit!
    customers = Customer.where(shopify_customer_id: params['customer']['id'])
    if customers.present?
      customers.destroy_all
    end
    head :no_content
  end

  def customer_data_request
    params.permit!
    customers = Customer.where(shopify_customer_id: params['customer']['id'])
    if customers.present?
      save_path = Rails.root.join('app/assets/csvs/customer_data.csv')
      Customer.to_csv(params['customer']['id'], save_path)
      shop = customers.first.shop
      if shop.setting.present?
        integration = shop.integrations.find_by(name: 'SendGrid')
        email_notification = shop.setting.email_notifications.where.not(from_email: nil)
        if integration.present? && integration.credentials.present? && email_notification.present?
          from = email_notification.last.from_email
          shop.connect
          shopify_shop = ShopifyAPI::Shop.current
          to = shopify_shop.email
          subject = 'Customer Data'

          mail = Mail.new(from: from, to: to, subject: subject, body: '')
          mail.attachments['customer_data.csv'] = File.read(save_path)

          sg = SendGrid::API.new(api_key: integration.credentials[:private_key])
          sg.client.mail._('send').post(request_body: mail.to_json)
        end
      end
      File.delete(save_path)
    end
    head :no_content
  rescue StandardError
    File.delete(Rails.root.join('app/assets/csvs/customer_data.csv'))
    head :no_content
  end

  private

  def webhook_params
    params.except(:controller, :action, :type)
  end
end
