class SmsService::MessageGenerateService
  def initialize(shop, customer, subscription, custom_data = nil)
    @shopify_shop = ShopifyAPIRetry::REST.retry { ShopifyAPI::Shop.current }
    @shop = shop
    @customer = customer
    @subscription = subscription
    @custom_data = custom_data
  end

  def content(title)
    message = @shop.smarty_messages.where(title: title).where.not(body: nil).order(updated_at: :desc).first
    message.present? ? variables_mapping(message.body) : 'Thanks for your response, we will get back to you.'
  end

  def variables_mapping(message)
    @shop.smarty_variables.each do |variable|
      case variable.name
      when 'shop_name'
        message = message.gsub("{{#{variable.name}}}", @shopify_shop.name) if @shopify_shop.present?
      when 'subscription_title'
        message = message.gsub("{{#{variable.name}}}", @subscription.lines.edges&.first&.node&.title) if @subscription.present?
      when 'subscription_charge_date'
        message = message.gsub("{{#{variable.name}}}", @custom_data[:subscription_charge_date].to_s) if @custom_data.present?
      when 'shop_email'
        message = message.gsub("{{#{variable.name}}}", @shopify_shop.email) if @shopify_shop.email.present?
      when 'subscription_interval_frequency'
        message = message.gsub("{{#{variable.name}}}", @subscription.billing_policy&.interval_count) if @subscription.present?
      when 'subscription_interval_unit'
        message = message.gsub("{{#{variable.name}}}", @subscription.billing_policy&.interval) if @subscription.present?
      when 'delay_weeks'
        message = message.gsub("{{#{variable.name}}}", @custom_data[:delay_weeks].to_s) if @custom_data.present?
      when 'first_name'
        message = message.gsub("{{#{variable.name}}}", @customer.first_name) if @customer.present? && @customer.first_name.present?
      when 'old_charge_date'
        message = message.gsub("{{#{variable.name}}}", @custom_data[:old_charge_date].to_s) if @custom_data.present?
      when 'line_item_qty'
        message = message.gsub("{{#{variable.name}}}", @custom_data[:line_item_qty].to_s) if @custom_data.present?
      when 'line_item_list'
        message = message.gsub("{{#{variable.name}}}", @subscription.lines.edges.each_with_index.map{|line, i| "#{i+1}. #{line.node.id.split("gid://shopify/SubscriptionLine/")[1]} #{line.node.title}"}.join("\n")) if @subscription.present?
      when 'line_item_name'
        message = message.gsub("{{#{variable.name}}}", @custom_data[:line_item_name].to_s) if @custom_data.present?
      when 'card_brand - card_last4'
        if @subscription.present?
          order = ShopifyAPI::Order.find(@subscription.origin_order.id[/\d+/]) rescue nil
          card = order&.payment_details
          message = message.gsub("{{#{variable.name}}}", "#{card&.credit_card_company} - #{card&.credit_card_number}")
        end
      when 'card_exp_month/card_exp_year'
        if @subscription.present?
          order = ShopifyAPI::Order.find(@subscription.origin_order.id[/\d+/]) rescue nil
          card = order&.payment_details
          message = message.gsub("{{#{variable.name}}}", card.respond_to?(:credit_card_expiration_month) ? "#{card&.credit_card_expiration_month}/#{card&.credit_card_expiration_year}" : '-')
        end
      when 'cancellation_reasons'
        message = message.gsub("{{#{variable.name}}}", @customer.shop.smarty_cancellation_reasons.each_with_index.map{|reason, i| "#{i+1}. #{reason.name}"}.join("\n")) if @customer.present?
      end
    end
    message
  end
end
