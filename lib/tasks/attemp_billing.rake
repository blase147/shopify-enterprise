namespace :subscriptions do
  task :attemp_billing => :environment do
    Shop.find_each do |shop|
      shop.connect

      has_next_page = true
      next_cursor = nil

      while has_next_page
        data = SubscriptionContractsService.new.run next_cursor
        subscriptions = data[:subscriptions] || []

        subscriptions.each do |subscription|
          process_subscription(subscription.node)
        end

        has_next_page = data[:has_next_page]
        next_cursor = data[:next_cursor]
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
          message_service = SmsService::MessageGenerateService.new(customer.shop, customer, subscription)
          message = message_service.content('Opt-in - success')
          p message
          TwilioServices::SendSms.call(from: shop.phone, to: customer.phone, message: message)
        end
      end
    end
  end

  def process_subscription subscription
    return unless subscription.status == 'ACTIVE'

    id = subscription.id
    billing_date = DateTime.parse subscription.next_billing_date

    if billing_date.utc.beginning_of_day == Time.current.utc.beginning_of_day
      SubscriptionBillingAttempService.new(id).run
      ScheduleSkipService.new(id[/\d+/]).run
    end
  rescue Exception => ex
    p ex.message
  end
end
