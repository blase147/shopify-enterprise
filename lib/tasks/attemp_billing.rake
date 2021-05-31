namespace :subscriptions do
  task :attemp_billing => :environment do
    Shop.find_each do |shop|
      shop.connect
      result = SubscriptionContractsService.new.all_subscriptions
      subscriptions = result[:subscriptions] || []
      subscriptions.each do |subscription|
        process_subscription(subscription.node)
      end
    end
  end

  task :retries_attemp_billing => :environment do
    Shop.find_each do |shop|
      shop.connect
      shop.subscription_logs.pending_executions.each do |subs_log|
        subscription = SubscriptionContractService.new(subs_log.subscription_id).run
        reprocess_subscription(subscription, subs_log)
      end
    end
  end

  task :expire_conversation => :environment do
    SmsConversation.where('last_activity_at < ?', Time.current - 10.minutes).update_all(status: :expired)
  end

  task :opt_in_success => :environment do
    customers = Customer.where(opt_in_reminder_at: (Time.current - 10.minutes)..Time.current)
    customers.each do |customer|
      shop = customer.shop
      shop.connect
      if customer.shopify_id.present?
        subscription = SubscriptionContractService.new(customer.shopify_id).run
        unless subscription.is_a?(Hash)
          conversation = customer.sms_conversations.order(created_at: :asc).first
          if conversation.present? && conversation.sms_messages.present? && conversation.sms_messages.order(created_at: :asc).first.command != 'STOP'
            message_service = SmsService::MessageGenerateService.new(customer.shop, customer, subscription)
            message = message_service.content('Opt-in - success')
            p message
            TwilioServices::SendSms.call(from: shop.phone, to: customer.phone, message: message)
          end
        end
      end
    end
  end

  task :renewal_reminder => :environment do
    Shop.find_each do |shop|
      shop.connect
      result = SubscriptionContractsService.new.all_subscriptions
      subscriptions = result[:subscriptions] || []
      subscriptions.each do |subscription|
        check_for_renewal(subscription.node)
      end
    end
  end

  def process_subscription(subscription)
    return unless subscription.status == 'ACTIVE'
    billing_date = DateTime.parse subscription.next_billing_date
    subscription_id = subscription.id[/\d+/]
    customer = Customer.find_by(shopify_id: subscription_id)
    if billing_date.utc.beginning_of_day == Time.current.utc.beginning_of_day
      result = SubscriptionBillingAttempService.new(subscription.id).run
      if result[:error].present?
        if customer.present? && customer.shop.sms_setting.present? && customer.shop.sms_setting.failed_renewal.present?
          message_service = SmsService::MessageGenerateService.new(shop, customer, subscription)
          message = message_service.content('Charge - Failure')
          TwilioServices::SendSms.call(from: shop.phone, to: customer.phone, message: message)
          customer.update_columns(failed_at: Time.current)
          SubscriptionLog.create(billing_status: :failure, executions: (customer.shop.setting.payment_retries.to_i>0 ? true : false), customer_id: customer.id, shop_id: customer.shop_id, subscription_id: subscription_id)
          email_notification = EmailNotification.find_by_name "Card declined"
          EmailService::Klaviyo.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
        end
      else
        ScheduleSkipService.new(subscription_id).run
        SubscriptionLog.create(billing_status: :success, customer_id: customer.id, shop_id: customer.shop_id, subscription_id: subscription_id)
        email_notification = EmailNotification.find_by_name "Recurring Charge Confirmation"
        EmailService::Klaviyo.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
      end
    end
  rescue StabdardError => e
    p e.message
  end

  def reprocess_subscription(subscription, subs_log)
    return unless subscription.status == 'ACTIVE'
    billing_date = DateTime.parse subscription.next_billing_date
    subscription_id = subscription.id[/\d+/]
    customer = Customer.find_by(shopify_id: subscription_id)
    if customer.present? && customer.shop.sms_setting.present? && customer.shop.sms_setting.failed_renewal.present? && customer.retry_count<=customer.shop.setting.payment_retries
      if billing_date.utc.beginning_of_day == Time.current.utc.beginning_of_day
        result = SubscriptionBillingAttempService.new(subscription.id).run
        if result[:error].present?
          message_service = SmsService::MessageGenerateService.new(shop, customer, subscription)
          message = message_service.content('Charge - Failure')
          TwilioServices::SendSms.call(from: shop.phone, to: customer.phone, message: message)
          customer.update_columns(failed_at: Time.current, retry_count: customer.retry_count.succ)
          if customer.retry_count>=customer.shop.setting.payment_retries
            subs_log.update(billing_status: :churn, executions: false)
          end
          email_notification = EmailNotification.find_by_name "Card declined"
          EmailService::Klaviyo.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
          # subscription = SubscriptionContractService.new(id).run
        else
          next_schedule_date = (Time.current+subscription.billing_policy.interval_count.days).to_date
          ScheduleSkipService.new(subscription_id).run({ billing_date: next_schedule_date })
          customer.update_columns(failed_at: nil, retry_count: 0)
          subs_log.update(billing_status: :retry_success, executions: false)
          email_notification = EmailNotification.find_by_name "Recurring Charge Confirmation"
          EmailService::Klaviyo.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
        end
      end
    end
  rescue StabdardError => e
    p e.message
  end

  def check_for_renewal(subscription)
    return unless subscription.status == 'ACTIVE'

    billing_date = DateTime.parse subscription.next_billing_date
    customer = Customer.find_by(shopify_id: subscription.id[/\d+/])
    sms_setting = customer.shop.sms_setting
    if customer.present? && sms_setting.present? && sms_setting.renewal_reminder.present? && sms_setting.renewal_duration.present?
      renewal_day = sms_setting.renewal_duration.split(' ')
      if (billing_date.utc.beginning_of_day - renewal_day[0].to_i.send(renewal_day[1])).beginning_of_day == Time.current.utc.beginning_of_day
        message_service = SmsService::MessageGenerateService.new(shop, customer, subscription)
        message = message_service.content('Charge - Reminder')
        TwilioServices::SendSms.call(from: shop.phone, to: customer.phone, message: message)
      end
    end
  rescue StabdardError => e
    p e.message
  end

  def renewal_reminder(subscription)
    return unless subscription.status == 'ACTIVE'

    billing_date = DateTime.parse subscription.next_billing_date
    customer = Customer.find_by(shopify_id: subscription.id[/\d+/])
    if billing_date.utc.beginning_of_day.to_date == (Time.current-3.days).utc.beginning_of_day.to_date
      email_notification = EmailNotification.find_by_name "Upcoming Charge"
      EmailService::Klaviyo.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
    end
  end

end
