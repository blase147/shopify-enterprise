class SmsService::SharedService
  def initialize(conversation, params)
    @conversation = conversation
    @params = params
    @conversation.customer.shop.connect
  end

  def create_sms_message(message, step, comes_from_customer: false)
    @conversation.sms_messages.create(from_number: @conversation.customer.shop.phone, to_number: @params['From'], content: message, comes_from_customer: comes_from_customer, command: @conversation.command, command_step: step)
  end

  def send_message(content)
    puts "############################ #{content} ##############################"
    TwilioServices::SendSms.call(from: @params['To'], to: @params['From'], message: content)
  end

  def customer_subscriptions(shopify_id)
    CustomerSubscriptionContractsService.new("gid://shopify/Customer/#{shopify_id}").run
  end

  def subscription_draft(contract_id)
    result = SubscriptionContractUpdateService.new(contract_id).get_draft nil
    result[:draft_id]
  end

  def get_all_subscriptions(data)
    data[:active_subscriptions].each_with_index.map{ |subscription, i| "#{i+1}. #{subscription.node.id[/\d+/]} #{subscription.node.next_billing_date.to_date.strftime("%a, %B %e")} #{subscription.node.status}" }.join("\n")
  end

  def all_subscriptions_by_status(data, status)
    data[:subscriptions].each_with_index.map { |subscription, i| subscription.status == status ? "#{i+1}. #{subscription.id[/\d+/]} #{subscription.next_billing_date.to_date.strftime("%a, %B %e")} #{subscription.status}" : nil }.compact.join("\n")
  end

  def subscription_shopify_id(id)
    "gid://shopify/SubscriptionContract/#{id}"
  end

  def get_all_products(products)
    products.each_with_index.map{ |product, i| "#{i+1}. #{product.node.id[/\d+/]} #{product.node.title}" }.join("\n")
  end

  def valid_subscription(data, id)
    data[:active_subscriptions].any?{|subscription| subscription.node.id == id}
  end
end
