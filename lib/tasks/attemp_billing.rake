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
          if conversation.present? && conversation.sms_messages.present? && conversation.sms_messages.order(created_at: :asc).first.command == 'STOP'
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
    customer = Customer.find_by(shopify_id: subscription.id[/\d+/])
    if billing_date.utc.beginning_of_day == Time.current.utc.beginning_of_day
      result = SubscriptionBillingAttempService.new(id).run
      if result[:error].present?
        if customer.present? && customer.shop.sms_setting.present? && customer.shop.sms_setting.failed_renewal.present?
          message_service = SmsService::MessageGenerateService.new(shop, customer, subscription)
          message = message_service.content('Charge - Failure')
          TwilioServices::SendSms.call(from: shop.phone, to: customer.phone, message: message)
        end
      else
        ScheduleSkipService.new(subscription.id[/\d+/]).run
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
end
