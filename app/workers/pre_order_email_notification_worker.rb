class PreOrderEmailNotificationWorker
  include Sidekiq::Worker

  def perform(contract_id)
    contract = CustomerSubscriptionContract.find_by_id contract_id
    contract ||= CustomerSubscriptionContract.find_by(shopify_id: contract_id)

    week_number = Date.current.cweek
    shop = contract.shop
    meals_on_plan = contract.subscription.split[0].to_i
    trigger_email = false

    pre_order = WorldfarePreOrder.find_by(shopify_contract_id: contract.shopify_id, week: week_number)

    pre_order_products = JSON.parse(pre_order.products) rescue []

    trigger_email = true if pre_order_products.count < meals_on_plan

    if trigger_email
      @email_notification = shop.setting.email_notifications.find_by_name "Fill PreOrder"
      customer_object = {customer: contract}
      if EmailService::Send.new(@email_notification).send_email(customer_object)
        SiteLog.create(log_type: SiteLog::TYPES[:email_success], message: "PreOrderEmailNotification sent")
      else
        SiteLog.create(log_type: SiteLog::TYPES[:email_failure], params: {id: contract.id, shopify_id: contract.shopify_customer_id })
      end
    end
  rescue => e
    params = {contract_id: contract_id}
    message = "#{e.message} from #{e.backtrace.first}"
    SiteLog.create(log_type: SiteLog::TYPES[:sidekiq_job_failure], message: message, params: params)
  end
end
