class CustomerInsightReportService
  def initialize(shop, subscriptions, range)
    @shop = shop
    @subscriptions = subscriptions
    @range = range
  end

  def percentage(past_data, new_data, total)
    percent = Percentage.change(past_data.to_f, new_data.to_f).to_i rescue 0
    { value: total.to_f.round(2), percent: percent, up: percent.positive? }
  end

  def swap_count
    @shop.subscription_logs.swap.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).count
  end

  def skip_count
    @shop.subscription_logs.skip.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).count
  end

  def restart_count
    @shop.subscription_logs.restart.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).count
  end

  def upsell_count
    @shop.subscription_logs.upsell.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).count
  end

  def graph_data_by_granularity(method)
    @range.map(&"beginning_of_#{granularity}".to_sym).uniq.map do |date|
      {
        date: date.strftime(granularity == 'year' ? '%Y' : '%b %d'),
        data: send(method, date.instance_eval("beginning_of_#{granularity}")..date.instance_eval("end_of_#{granularity}"))
      }
    end
  end

  def active_vs_churned_skip_data
    {
      active_customers: logs_customer_count('ACTIVE', :skip, @range),
      churned_customers: logs_customer_count('CANCELLED', :skip, @range)
    }
  end

  def active_vs_churned_swap_data
    {
      active_customers: logs_customer_count('ACTIVE', :swap, @range),
      churned_customers: logs_customer_count('CANCELLED', :swap, @range)
    }
  end

  def active_vs_churned_restart_data
    {
      active_customers: logs_customer_count('ACTIVE', :restart, @range),
      churned_customers: logs_customer_count('CANCELLED', :restart, @range)
    }
  end

  def active_vs_churned_upsell_data
    {
      active_customers: logs_customer_count('ACTIVE', :upsell, @range),
      churned_customers: logs_customer_count('CANCELLED', :upsell, @range)
    }
  end

  def dunning_data(range)
    { value: dunning_count(range) }
  end

  def dunning_recovered_data(range)
    { value: recovered_count(range) }
  end

  def dunning_churn_data(range)
    { value: churned_count(range) }
  end

  def logs_customer_count(status, action, range)
    @shop.customers.joins(:subscription_logs)
         .where(customers: { status: status }, subscription_logs: { action_type: action })
         .where('subscription_logs.created_at::date BETWEEN ? AND ?', range.first, range.last).count
  end

  def sales_per_charge
    orders_count(@range).zero? ? 0 : @subscriptions.sum { |subscription| get_orders_total_amount(subscription, @range) } / orders_count(@range)
  end

  def charge_per_customer
    sub_customers_count.zero? ? 0 : @subscriptions.sum { |subscription| get_orders_total_amount(subscription, @range) } / sub_customers_count
  end

  def orders_count(range = nil)
    @subscriptions.sum { |subscription| subscription.node.orders.edges.count { |order| range.cover?(order.node.created_at.to_date)} }
  end

  def sub_customers_count
    @shop.customers.where('shopify_at::date BETWEEN ? AND ? AND (status = ? OR failed_at IS NOT NULL)', @range.first, @range.last, 'ACTIVE').count
  end

  def churn_rate
    customer_at_period_start = in_period_subscriptions(@subscriptions, @range.first - 1.year..@range.first - 1.day, 'ACTIVE').count
    cancelled_customer_in_period = in_period_subscriptions(@subscriptions, @range, 'CANCELLED').count
    customer_at_period_start.zero? ? 0 : (cancelled_customer_in_period * 100) / customer_at_period_start
  end

  def in_period_subscriptions(subscriptions, range, status = nil)
    subscriptions.select { |subscription| range.cover?(subscription.node.created_at.to_date) && (status ? subscription.node.status == status : true) }
  end

  def get_orders_total_amount(subscription, range = nil)
    subscription.node.orders.edges.sum { |order| range.nil? || range.present? && (range.cover?(order.node.created_at.to_date)) ? order.node.total_price_set.presentment_money.amount.to_f.round(2) : 0 }
  end

  def dunning_count(range = nil)
    range = range.present? ? range: @range
    @shop.subscription_logs.failure.where('created_at::date BETWEEN ? AND ?', range.first, range.last).count
  end

  def recovered_count(range = nil)
    range = range.present? ? range: @range
    @shop.subscription_logs.retry_success.where('created_at::date BETWEEN ? AND ?', range.first, range.last).count
  end

  def churned_count(range = nil)
    range = range.present? ? range: @range
    @shop.subscription_logs.churn.where('created_at::date BETWEEN ? AND ?', range.first, range.last).count
  end

  def recovered
    dunning_count.zero? ? 0 : (recovered_count.to_f / dunning_count) * 100
  end

  def churned
    dunning_count.zero? ? 0 : (churned_count.to_f / dunning_count) * 100
  end

  def dunned
    (dunning_customers_count / customers_count('ACTIVE')) * 100 rescue 0
  end

  def customers_count(status = nil)
    @shop.customers.where('shopify_at::date BETWEEN ? AND ?', @range.first, @range.last)
         .where(status.present? ? "status='#{status}'" : 'status IS NOT NULL').count
  end

  def dunning_customers_count
    @shop.customers.where('shopify_at::date BETWEEN ? AND ?', @range.first, @range.last).where.not(failed_at: nil).count
  end

  def customers_percentage(status)
    customers_count.zero? ? 0 : (customers_count(status).to_f / customers_count) * 100
  end

  def dunning_customers_percentage
    customers_count.zero? ? 0 : (dunning_customers_count.to_f / customers_count) * 100
  end

  def sku_by_customers
    subscriptions = subscriptions_by_order_period(@subscriptions, @range)
    customers = []
    products = Hash.new(0)
    subscriptions.each do |sub|
      next unless sub.node.lines.edges.present?

      sub.node.lines.edges.each do |line|
        products[line.node.sku] = products[line.node.sku] + 1 unless customers.include?(sub.node.customer.id)
      end
      customers.push(sub.node.customer.id)
    end
    products.sort_by { |_key, val| val }.reverse.to_h.first(14).map { |key, val| { sku: key, value: val } }
  end

  def billing_frequency
    subscriptions = subscriptions_by_order_period(@subscriptions, @range)
    frequency = Hash.new(0)
    subscriptions.each do |sub|
      interval = "#{sub.node.billing_policy.interval_count} #{sub.node.billing_policy.interval.capitalize}"
      frequency[interval] = frequency[interval] + 1
    end
    subscriptions_count = frequency.inject(0) { |sum, hash| sum + hash[1] }
    subscriptions_count.zero? ? {} : frequency.map { |key, val| { billing_policy: key, value: ((val.to_f / subscriptions_count) * 100).round(2) } }
  end

  def cancellation_reasons
    @shop.customers.joins(:reasons_cancel).select('COUNT(*) AS value, reasons_cancels.title AS cancellation_reason')
         .group('reasons_cancels.title').order('COUNT(*) DESC')
  end

  def granularity
    range = 'day'
    if @range.count > 30
      range = 'month'
    elsif @range.count > 365
      range = 'year'
    end
    range
  end

  def subscriptions_by_order_period(subscriptions, range)
    subscriptions.select { |subscription| subscription if subscription.node.orders.edges.count { |order| range.cover?(order.node.created_at.to_date) }.positive? }
  end
end
