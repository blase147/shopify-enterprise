class ReportDataService
  def initialize(subscriptions, shop, orders = nil, range = nil)
    @subscriptions = subscriptions
    @orders = orders
    @range = range
    @shop = shop
  end

  def calculate_percentage(past_data, new_data, original_data)
    percent = Percentage.change(past_data.to_f, new_data.to_f).to_i rescue 0
    { value: original_data.to_f.round(2), percent: percent, up: percent.positive? }
  end

  def mrr(subscriptions, _range)
    previous_month_range = (Date.today - 1.month).beginning_of_month..(Date.today - 1.month).end_of_month
    previous_month_revenue = subscriptions&.sum { |subscription| get_orders_total_amount(subscription, previous_month_range)}
    current_month_revenue = subscriptions.sum { |subscription| get_orders_total_amount(subscription, Date.today.beginning_of_month..Date.today) }
    previous_month_revenue + current_month_revenue
  end


  def get_subscriptions_count(subscriptions, status)
    subscriptions.sum { |subscription| subscription.node.status == status ? subscription.node.lines.edges.count : 0 }
  end

  def get_churn_rate(subscriptions, range)
    customer_at_period_start = customer_at_period_start(subscriptions, range)
    cancelled_customer_in_period = in_period_cancelled_subscriptions(subscriptions, range).count
    (cancelled_customer_in_period * 100) / customer_at_period_start rescue 0
    # (get_subscriptions_count(subscriptions_in_period, 'ACTIVE') * 100) / subscriptions.count
  end

  def customer_at_period_start(subscriptions, range)
    active_subs_before_period = in_period_subscriptions(subscriptions, range.first - 2.year..range.first - 1.day, 'ACTIVE').count
    cancelled_sub_after_period = @shop.customer_subscription_contracts.where(status: 'CANCELLED').where('shopify_at::date BETWEEN ? AND ?', range.first - 2.year, range.first - 1.day).where('cancelled_at::date > ?', range.last).count
    active_subs_before_period + cancelled_sub_after_period
  end

  def get_customer_lifetime_value(subscriptions)
    range = (Date.today - 1.day) - 1.month..Date.today - 1.day
    customer_data = subscriptions.group_by { |subscription| subscription.node.customer.id }
    (mrr(subscriptions, range) / customer_data.size) * 100  rescue 0
  end

  def year_graph_data(subscriptions, range, method)
    range.map(&:beginning_of_year).uniq.map do |date|
      {
        date: date.strftime('%Y'),
        data: { value: send(method, date, subscriptions) }
      }
    end
  end

  def revenue_churn_by_date(range)
    subscriptions_in_period = in_period_subscriptions(@subscriptions, range)
    cancelled_subscriptions_revenue = subscriptions_in_period.sum { |subscription| subscription.node.status == 'CANCELLED' ? get_orders_total_amount(subscription, range) : 0 }
    order_total = subscriptions_in_period.sum { |subscription| get_orders_total_amount(subscription, range) }
    churn_data = ((order_total - (order_total - cancelled_subscriptions_revenue)) / order_total) * 100 rescue 0
    { value: churn_data }
  end

  def sales_data_by_date(range)
    subscriptions = in_period_subscriptions(@subscriptions, range)
    { value: subscriptions.sum { |subscription| get_orders_total_amount(subscription, range) } }
  end

  def refund_data_by_date(range)
    orders = @orders.select { |order| order if range.cover?(order.created_at.to_date) }
    { value: refunded_amount(orders) }
  end

  def refunded_amount(orders)
    orders.sum {|order| order.refunds.sum { | refund| refund.total_refunded_set.shop_money.amount.to_f}}
  end

  def arr_data_by_date(date, subscriptions)
    range = date.beginning_of_year..date.end_of_year
    current_year_subscriptions = in_period_subscriptions(subscriptions, range, 'ACTIVE')
    current_year_subscriptions.sum { |subscription| get_orders_total_amount(subscription, range) }.to_f.round(2)
  end

  def mrr_data_by_date(range)
    previous_month_range = (range.first - 1.day).beginning_of_month..(range.first - 1.day).end_of_month
    previous_month_revenue = @subscriptions.sum { |subscription| get_orders_total_amount(subscription, previous_month_range)}
    current_month_revenue = @subscriptions.sum { |subscription| get_orders_total_amount(subscription, range.first..range.last) }
    { value: previous_month_revenue + current_month_revenue }
  end

  def get_orders_total_amount(subscription, range = nil)
    subscription.node&.orders&.edges&.sum { |order| range.nil? || (range.present? && range&.cover?(order&.node&.created_at&.to_date)) ? order&.node&.total_price_set&.presentment_money&.amount&.to_f&.round(2) : 0 }
  end

  def get_customers_by_date(range)
    current_month_subscriptions = in_period_subscriptions(@subscriptions, range, 'ACTIVE')
    { value: current_month_subscriptions.group_by { |subscription| subscription.node.customer.id }.count }
  end

  def renewal_data_by_date(range)
    pending_for_renewal = @subscriptions.count { |subscription| subscription.node.next_billing_date.to_date.between?(range.first, range.last) }
    renewed_subscriptions = @subscriptions.count { |subscription| subscription.node.orders.edges.count > 1 && (subscription_orders_in_range(subscription, range.first.to_date) >= 1)  }
    renewal_data = (renewed_subscriptions / pending_for_renewal) * 100 rescue 0
    { value: renewal_data }
  end

  def in_period_subscriptions(subscriptions, range, status = nil)
    subscriptions.select { |subscription| range.cover?(subscription.node.created_at.to_date) && (status ? subscription.node.status == status : true) }
  end

  def in_period_cancelled_subscriptions(subscriptions, range)
    subscriptions.select { |subscription| range.cover?(@shop.customer_subscription_contracts.find_by(status: 'CANCELLED', shopify_id: subscription.node.id[/\d+/])&.cancelled_at) && subscription.node.status == 'CANCELLED' }
  end

  def in_period_hourly_subscriptions(subscriptions, range, status = nil)
    subscriptions.select { |subscription| subscription.node.created_at.to_datetime.between?(range.first, range.last) && (status ? subscription.node.status == status : true) }
  end

  def subscription_orders_in_range(subscription, date)
    subscription.node.orders.edges.count { |order| order.node.created_at.to_date.between?(date.beginning_of_month, date.end_of_month) }
  end

  # Revenue Trends
  def get_total_sales(range = nil)
    orders = range.nil? ? @orders : @orders.select { |order| range.cover?(order&.created_at&.to_date) }
    orders&.sum { |order| order.total_price.to_f } - orders.sum {|order| order.refunds.sum { | refund| refund.total_refunded_set.shop_money.amount.to_f}}.round(2) if orders.present?
  end

  def charge_count(range)
    @orders.sum { |order| range.cover?(order.created_at.to_date) ? 1 : 0 }
  end

  def recurring_sales
    get_total_sales.zero? ? 0 : ((@subscriptions.sum { |subscription| get_orders_total_amount(subscription, @range) } / get_total_sales) * 100).to_f.round(2)
  end

  def sales_per_charge
    @subscriptions.sum { |subscription| get_orders_total_amount(subscription, @range) } / orders_count(@range) rescue 0
  end

  def orders_count(range = nil)
    # subscriptions = range.present? ? in_period_subscriptions(@subscriptions, range) : @subscriptions
    @subscriptions.sum { |subscription| subscription.node.orders.edges.count { |order| range.cover?(order.node.created_at.to_date)} }
  end

  def checkout_charge(range)
    orders = one_time_orders(range)
    orders_calculate_amount(orders)
  end

  def recurring_charge(range)
    # subscriptions = in_period_subscriptions(@subscriptions, range)
    @subscriptions.sum{ |subscription| get_orders_total_amount(subscription, range) }
  end

  def average_checkout_charge
    orders = one_time_orders(@range)
    orders.count.zero? ? 0 : orders_calculate_amount(orders) / orders.count
  end

  def one_time_orders(range)
    orders = @orders.select { |order| order if range.cover?(order.created_at.to_date) }
    subscription_order_ids = []
    @subscriptions.each do |subscription|
      subscription.node.orders.edges.each do |order|
        subscription_order_ids.push(order.node.id[/\d+/])
      end
    end
    orders.delete_if { |order| subscription_order_ids.include?(order.id) }
  end

  def orders_calculate_amount(orders)
    orders.sum {|order| order.refunds.sum { | refund| refund.total_refunded_set.shop_money.amount.to_f}}.round(2)
  end

  def average_recurring_charge
    @subscriptions.sum{ |subscription| get_orders_total_amount(subscription, @range) } / orders_count(@range) rescue 0
  end

  def new_customers
    @subscriptions.group_by { |subscription| subscription.node.customer.id }.sum { |data| data[1].count == 1 ? 1 : 0 }
  end

  def graph_data_by_granularity(method)
    @range.map(&"beginning_of_#{granularity}".to_sym).uniq.map do |date|
      {
        date: date.strftime(granularity == 'year' ? '%Y' : '%b %d'),
        data: send(method, date.instance_eval("beginning_of_#{granularity}")..date.instance_eval("end_of_#{granularity}"))
      }
    end
  end

  def granularity
    range = 'day'
    if @range.count > 32
      range = 'month'
    elsif @range.count > 366
      range = 'year'
    end
    range
  end

  def active_vs_churned_data(range)
    {
      active_customers: active_customers(range),
      churned_customers: cancelled_customers(range)
    }
  end

  def active_customers(range)
    subscriptions = active_subscriptions(range)
    subscriptions.group_by { |subscription| subscription.node.customer.id }.count
  end

  def all_active_customers
    subscriptions = @subscriptions.select { |subscription| subscription.node.status == 'ACTIVE' }
    subscriptions.group_by { |subscription| subscription.node.customer.id }.count
  end

  def cancelled_customers(range)
    @shop.customer_subscription_contracts.where(status: 'CANCELLED').where('cancelled_at::date BETWEEN ? AND ?', range.first - 2.year, range.last).count
  end

  def cancelled_subscriptions_in_period(range)
    @shop.customer_subscription_contracts.where(status: 'CANCELLED').where('cancelled_at::date BETWEEN ? AND ?', range.first, range.last).count
  end

  def active_subscriptions(range)
    active_customers_subscriptions = in_period_subscriptions(@subscriptions, (range.first - 2.years)..range.last, 'ACTIVE')
    cancelled_subscription_ids = @shop.customer_subscription_contracts.where(status: 'CANCELLED').where('cancelled_at::date > ?', range.last).where('shopify_at::date BETWEEN ? AND ?', range.first - 2.year, range.last).pluck('shopify_id')
    active_customers_subscriptions + @subscriptions.select{ |sub| cancelled_subscription_ids.include?(sub.node.id[/\d+/]) }
  end

  def total_sales_data(range)
    {
      value: recurring_charge(range),
      charge_count: orders_count(range)
    }
  end

  def refunds_data(range)
    orders = @orders.select { |order| order if range.cover?(order.created_at.to_date) }
    {
      value: refunded_amount(orders),
      refunds_count: orders.sum { |order| order.refunds.count.positive? ? 1 : 0 }
    }
  end

  def active_customers_data(range)
    { value: active_customers(range) }
  end

  def new_vs_cancelled_data(range)
    { new_subscriptions_count: in_period_subscriptions(@subscriptions, range, 'ACTIVE').count, cancelled_subscriptions_count: cancelled_subscriptions_in_period(range) }
  end

  def get_upcoming_revenue(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date.to_date) ? get_orders_total_amount(subscription) : 0 }.to_f.round(2)
  end

  def get_upcoming_historical_revenue(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date.to_date) ? subscription.node.orders.edges.sum { |order| order.node.original_total_price_set.presentment_money.amount.to_f } : 0 }.to_f.round(2)
  end

  def get_upcoming_error_revenue(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date.to_date) ? subscription.node.orders.edges.sum { |order| calculated_error_revenue(order) } : 0}.to_f.round(2)
  end

  def calculated_error_revenue(order)
    order.node.transactions.sum { |transaction| transaction.status == 'ERROR' ? transaction.amount_set.presentment_money.amount.to_f : 0 }
  end

  def get_upcoming_charge(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date.to_date) ? 1 : 0 }
  end

  def recurring_vs_checkout_data(range)
    {
      recurring_sales: recurring_charge(range),
      one_time_sales: checkout_charge(range).to_f.round(2)
    }
  end

  def get_upcoming_error_charges(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date.to_date) ? error_transactions_count(subscription) : 0 }
  end

  def error_transactions_count(subscription)
    subscription.node.orders.edges.sum { |order| order.node.transactions.sum { |transaction| transaction.status == 'ERROR' ? 1 : 0 } }
  end

  def same_day_cancelled
    @shop.customer_subscription_contracts.where('shopify_at::date = cancelled_at::date').count
  end

  def sku_by_revenue
    subscriptions = subscriptions_by_order_period(@subscriptions, @range)
    products = Hash.new(0)
    subscriptions.each do |sub|
      next unless sub.node.lines.edges.present?

      sub.node.lines.edges.each do |line|
        products[line.node.sku] += get_orders_total_amount(sub, @range)
      end
    end
    products.sort_by { |_key, val| val }.reverse.to_h.first(14).map { |key, val| { sku: key, value: val } }
  end

  def sku_by_subscriptions(subscriptions = nil)
    subscriptions = subscriptions.present? ? subscriptions : subscriptions_by_order_period(@subscriptions, @range)
    products = Hash.new(0)
    subscriptions.each do |sub|
      next unless sub.node.lines.edges.present?

      sub.node.lines.edges.each do |line|
        products[line.node.sku] += 1
      end
    end
    products.sort_by { |_key, val| val }.reverse.to_h.first(14).map { |key, val| { sku: key, value: val } }
  end

  def sku_by_customers
    subscriptions = subscriptions_by_order_period(@subscriptions, @range)
    customers = []
    products = Hash.new(0)
    subscriptions.each do |sub|
      next unless sub.node.lines.edges.present?

      sub.node.lines.edges.each do |line|
        products[line.node.sku] += 1 unless customers.include?(sub.node.customer.id)
      end
      customers.push(sub.node.customer.id)
    end
    products.sort_by { |_key, val| val }.reverse.to_h.first(14).map { |key, val| { sku: key, value: val } }
  end

  def billing_frequency_revenue
    subscriptions = subscriptions_by_order_period(@subscriptions, @range)
    frequency = Hash.new(0)
    subscriptions.each do |sub|
      interval = "#{sub.node.billing_policy.interval_count} #{sub.node.billing_policy.interval.capitalize}"
      frequency[interval] += get_orders_total_amount(sub, @range)
    end
    subscriptions_revenue_total = frequency.inject(0) { |sum, hash| sum + hash[1] }
    subscriptions_revenue_total.zero? ? {} : frequency.map { |key, val| { billing_policy: key, value: ((val.to_f / subscriptions_revenue_total) * 100).round(2) } }
  end

  def sku_by_frequency
    subscriptions = subscriptions_by_order_period(@subscriptions, @range)
    data = []
    sub_by_frequency = subscriptions&.group_by{ |sub| "#{sub.node.billing_policy.interval_count} #{sub.node.billing_policy.interval.capitalize}"}
    sub_by_frequency&.each do |billing_frequecny, subscriptions|
      sku_by_subscriptions = sku_by_subscriptions(subscriptions).first(5)
      if sku_by_subscriptions.present?
        skus_total_count = sku_by_subscriptions.inject(0) { |sum, hash| sum + hash[:value] }
        skus = sku_by_subscriptions.map { |sku| { sku: sku[:sku], value: skus_total_count.zero? ? 0 : ((sku[:value].to_f / skus_total_count) * 100).round(2) } }
        data.push({ billing_policy: billing_frequecny, skus: skus })
      end
    end
    data.empty? ? {} : data
  end

  def subscriptions_by_order_period(subscriptions, range)
    subscriptions.select { |subscription| subscription if subscription.node.orders.edges.count { |order| range.cover?(order.node.created_at.to_date) }.positive? }
  end
end