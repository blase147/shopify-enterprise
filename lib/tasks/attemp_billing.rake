namespace :subscriptions do
  task :attemp_billing => :environment do
    puts "Cron for attempt billing: at #{Time.current}"
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
    puts "Cron for retry attempt billing: at #{Time.current}"
    Shop.find_each do |shop|
      shop.connect
      shop.subscription_logs.pending_executions.each do |subs_log|
        subscription = SubscriptionContractService.new(subs_log.subscription_id).run
        reprocess_subscription(subscription, subs_log)
      end
    end
  end

  task :expire_conversation => :environment do
    puts "Cron for expire conversations: at #{Time.current}"
    SmsConversation.where('last_activity_at < ?', Time.current - 10.minutes).update_all(status: :expired)
  end

  task :opt_in_success => :environment do
    customers = CustomerSubscriptionContract.where(opt_in_reminder_at: (Time.current - 10.minutes)..Time.current)
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
    puts "Cron for renewal reminder: at #{Time.current}"
    Shop.find_each do |shop|
      shop.connect
      result = SubscriptionContractsService.new.all_subscriptions
      subscriptions = result[:subscriptions] || []
      subscriptions.each do |subscription|
        check_for_renewal(subscription.node)
      end
    end
  end

  task :sync_subscription_contracts => :environment do
    puts "Sync Subscription Contract #{Time.current}"
    Shop.find_each do |shop|
      if shop.shopify_domain.include?('ethey')
        shop.connect
        CustomerSubscriptionContract.where(shop_id: shop.id).find_each(batch_size: 100) do |contract|
          puts "<====== Processing ContractID, #{contract.id} ======>"
          data = shop.with_shopify_session do
            SubscriptionContractService.new(contract.shopify_id).run
          end

          next if data.nil?

          contract.assign_attributes(
            first_name: data.customer.first_name,
            last_name: data.customer.last_name,
            email: data.customer.email,
            phone: data.customer.phone,
            shopify_at: data.created_at.to_date,
            shopify_updated_at: data.updated_at&.to_date,
            status: data.status,
            subscription: data.lines.edges.first&.node&.title,
            language: "$#{data.lines.edges.first&.node&.current_price&.amount} / #{data.billing_policy.interval.pluralize}",
            communication: "#{data.billing_policy.interval_count} #{data.billing_policy.interval} Pack".titleize,
            api_source: 'shopify',
            shopify_customer_id: data.customer.id[/\d+/],
            api_data: data.to_h.deep_transform_keys { |key| key.underscore }
          )
          order_id = contract.api_data["origin_order"]["id"][/\d+/]
          order = ShopifyAPI::Order.find(order_id) rescue nil
          if order.present?
            puts "order found for #{order_id}"
            note_attributes = order&.note_attributes
            delivery_date = note_attributes.filter{|attr| attr.name == "Delivery Date" }.last&.value rescue nil
            delivery_date = delivery_date.to_date.strftime("%m/%d/%Y") if delivery_date.present? rescue nil
            delivery_day = note_attributes.filter{|attr| attr.name == "Delivery Day" }.last&.value rescue nil
            contract.api_data[:delivery_date] = delivery_date
            contract.api_data[:delivery_day] = delivery_day
            puts "delivery_date #{delivery_date}"
            puts "delivery_day #{delivery_day}"
          end
          contract.save
          puts "====== Done ContractID, #{contract.id} ======"
        end
      end
    end
  end

  def process_subscription(subscription)
    return unless subscription.status == 'ACTIVE'
    subscription_id = subscription.id[/\d+/]
    customer = CustomerSubscriptionContract.find_by(shopify_id: subscription_id)
    billing_date = get_next_billing_date(subscription, customer.shop)
    if billing_date.utc.beginning_of_day == Time.current.utc.beginning_of_day
      result = SubscriptionBillingAttempService.new(subscription.id).run
      if result[:error].present?
        if customer.present? && customer.shop.sms_setting.present? && customer.shop.sms_setting.failed_renewal.present?
          message_service = SmsService::MessageGenerateService.new(shop, customer, subscription)
          message = message_service.content('Charge - Failure')
          TwilioServices::SendSms.call(from: shop.phone, to: customer.phone, message: message)
          customer.update_columns(failed_at: Time.current)
          SubscriptionLog.create(billing_status: :failure, executions: (customer.shop.setting.payment_retries.to_i>0 ? true : false), customer_id: customer.id, shop_id: customer.shop_id, subscription_id: subscription_id)
          email_notification = customer.shop.setting.email_notifications.find_by_name "Card declined"
          EmailService::Send.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
        end
      else
        charge_store(result[:data].id, subscription_id, customer.shop)
        upcoming_date = get_upcoming_billing_date(subscription, customer.shop)
        ScheduleSkipService.new(subscription_id).run(upcoming_date.present? ? { billing_date: upcoming_date } : nil)
        SubscriptionLog.create(billing_status: :success, customer_id: customer.id, shop_id: customer.shop_id, subscription_id: subscription_id)
        email_notification = customer.shop.setting.email_notifications.find_by_name "Recurring Charge Confirmation"
        EmailService::Send.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
      end
    end
  rescue StandardError => e
    p e.message
  end

  def reprocess_subscription(subscription, subs_log)
    return unless subscription.status == 'ACTIVE'
    subscription_id = subscription.id[/\d+/]
    customer = CustomerSubscriptionContract.find_by(shopify_id: subscription_id)
    billing_date = get_next_billing_date(subscription, customer.shop)
    if customer.present? && customer.shop.sms_setting.present? && customer.shop.sms_setting.failed_renewal.present? && customer.retry_count<=customer.shop.setting.payment_retries
      if billing_date.utc.beginning_of_day + ((customer.shop.setting.payment_delay_retries || 0)*customer.retry_count).days == Time.current.utc.beginning_of_day
        result = SubscriptionBillingAttempService.new(subscription.id).run
        if result[:error].present?
          message_service = SmsService::MessageGenerateService.new(shop, customer, subscription)
          message = message_service.content('Charge - Failure')
          TwilioServices::SendSms.call(from: shop.phone, to: customer.phone, message: message)
          customer.update_columns(failed_at: Time.current, retry_count: customer.retry_count.succ)
          if customer.retry_count>=customer.shop.setting.payment_retries
            subs_log.update(billing_status: :churn, executions: false)
            case shop.setting.max_fail_strategy
            when 'cancel'
              SubscriptionContractDeleteService.new(subscription_id).run
            when 'pause'
              SubscriptionContractDeleteService.new(subscription_id).run('PAUSED')
            end
          end
          email_notification = customer.shop.setting.email_notifications.find_by_name "Card declined"
          EmailService::Send.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
          # subscription = SubscriptionContractService.new(id).run
        else
          charge_store(result[:data].id, subscription_id, customer.shop)
          upcoming_date = get_upcoming_billing_date(subscription, customer.shop)
          ScheduleSkipService.new(subscription_id).run(upcoming_date.present? ? { billing_date: upcoming_date } : nil)
          customer.update_columns(failed_at: nil, retry_count: 0)
          subs_log.update(billing_status: :retry_success, executions: false)
          email_notification = customer.shop.setting.email_notifications.find_by_name "Recurring Charge Confirmation"
          EmailService::Send.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
        end
      end
    end
  rescue StabdardError => e
    p e.message
  end

  def check_for_renewal(subscription)
    return unless subscription.status == 'ACTIVE'

    customer = CustomerSubscriptionContract.find_by(shopify_id: subscription.id[/\d+/])
    billing_date = get_next_billing_date(subscription, customer.shop)
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

    customer = CustomerSubscriptionContract.find_by(shopify_id: subscription.id[/\d+/])
    billing_date = get_next_billing_date(subscription, customer.shop)
    if billing_date.utc.beginning_of_day.to_date == (Time.current-3.days).utc.beginning_of_day.to_date
      email_notification = customer.shop.setting.email_notifications.find_by_name "Upcoming Charge"
      EmailService::Send.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
    end
  end

  def charge_store(billing_id, subscription_id, shop)
    if ENV['APP_TYPE'] == 'public'
      billing = SubscriptionBillingAttempService.new(subscription_id).get_attempt(billing_id)
      state = billing.data.subscription_billing_attempt.ready
      if state == true
        subscription = SubscriptionContractService.new(subscription_id).run
        StoreChargeService.new(shop).create_usage_charge(subscription)
      else
        charge_store(billing_id, subscription_id, shop)
      end
    end
  rescue StabdardError => e
    p e.message
  end

  def get_next_billing_date(subscription, shop)
    selling_plan_id = subscription.to_h.dig('lines', 'edges', 0, 'node', 'sellingPlanId')
    return DateTime.parse(subscription.next_billing_date) unless selling_plan_id.present?

    selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: shop.id }).find_by(shopify_id: selling_plan_id)
    if selling_plan.present? && selling_plan.billing_dates.present?
      current_date = Time.current
      selling_plan.billing_dates.include?(current_date.utc.to_date.to_s) ? current_date : DateTime.parse(subscription.next_billing_date)
    else
      DateTime.parse(subscription.next_billing_date)
    end
  end

  def get_upcoming_billing_date(subscription, shop)
    selling_plan_id = subscription.to_h.dig('lines', 'edges', 0, 'node', 'sellingPlanId')
    return false unless selling_plan_id.present?

    selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: shop.id }).find_by(shopify_id: selling_plan_id)
    if selling_plan.present? && selling_plan.billing_dates.present?
      selling_plan.billing_dates.select{ |plan| plan.to_date > Date.today }.sort.first
    end
  end

end
