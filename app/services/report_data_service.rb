class ReportDataService
  def initialize(subscriptions, orders = nil, granularity = nil, range = nil)
    @subscriptions = subscriptions
    @orders = orders
    @granularity = granularity
    @range = range
  end

  def get_date_range(duration)
    case duration
    when 'daily'
      Date.today..Date.today
    else
      Date.today - instance_eval(duration.downcase.split(' ').join('.'))..Date.today
    end
  end

  def get_subscriptions_count(subscriptions, status)
    subscriptions.sum { |subscription| subscription.node.status == status ? subscription.node.lines.edges.count : 0 }
  end

  def get_churn_rate(subscriptions, range)
    customer_at_period_start = in_period_subscriptions(subscriptions, range.first - 1.year..range.first - 1.day, 'ACTIVE')
    cancelled_customer_in_period = in_period_subscriptions(subscriptions, range, 'CANCELLED')
    (cancelled_customer_in_period * 100) / customer_at_period_start rescue 0
    # (get_subscriptions_count(subscriptions_in_period, 'ACTIVE') * 100) / subscriptions.count
  end

  def get_customer_lifetime_value(subscriptions)
    customer_data = subscriptions.group_by { |subscription| subscription.node.customer.id }
    customer_data.sum { |data| data[1].sum { |subscription| subscription.node.orders.edges.sum{ |order| order.node.total_price_set.presentment_money.amount.to_f} } } / customer_data.size  rescue 0
  end

  def month_graph_data(subscriptions, range, method)
    range.map(&:beginning_of_month).uniq.map do |date|
      {
        date: date.strftime('%b %d'),
        data: { value: send(method, date, subscriptions).to_f.round(2) }
      }
    end
  end

  def year_graph_data(subscriptions, range, method)
    range.map(&:beginning_of_year).uniq.map do |date|
      {
        date: date.strftime('%Y'),
        data: { value: send(method, date, subscriptions) }
      }
    end
  end

  def revenue_churn_by_date(date, subscriptions)
    subscriptions_in_period = in_period_subscriptions(subscriptions, date.beginning_of_month..date.end_of_month)
    cancelled_subscriptions_revenue = subscriptions_in_period.sum { |subscription| subscription.node.status == 'CANCELLED' ? get_orders_total_amount(subscription) : 0 }
    order_total = subscriptions_in_period.sum { |subscription| get_orders_total_amount(subscription) }
    (order_total - (order_total - cancelled_subscriptions_revenue)) / order_total rescue 0
  end

  def sales_data_by_date(date, subscriptions)
    subscriptions = in_period_subscriptions(subscriptions, date.beginning_of_month..date.end_of_month)
    subscriptions.sum { |subscription| get_orders_total_amount(subscription) }
  end

  def refund_data_by_date(date, subscriptions)
    subscriptions = in_period_subscriptions(subscriptions, date.beginning_of_month..date.end_of_month)
    refunded_amount(subscriptions)
  end

  def refunded_amount(subscriptions)
    subscriptions.sum { |subscription| subscription.node.orders.edges.sum { |order| order.node.total_refunded_set.presentment_money.amount.to_f.round(2) } }
  end

  def arr_data_by_date(date, subscriptions)
    current_year_subscriptions = in_period_subscriptions(subscriptions, date.beginning_of_year..date.end_of_year)
    current_year_subscriptions.sum { |subscription| get_orders_total_amount(subscription) }.to_f.round(2)
  end

  def mrr_data_by_date(date, subscriptions)
    current_month_subscriptions = in_period_subscriptions(subscriptions, date.beginning_of_month..date.end_of_month)
    current_month_subscriptions.sum { |subscription| get_orders_total_amount(subscription) }
  end

  def get_orders_total_amount(subscription)
    subscription.node.orders.edges.sum { |order| order.node.total_price_set.presentment_money.amount.to_f.round(2) }
  end

  def get_customers_by_date(date, subscriptions)
    current_month_subscriptions = in_period_subscriptions(subscriptions, date.beginning_of_month..date.end_of_month, 'ACTIVE')
    current_month_subscriptions.group_by { |subscription| subscription.node.customer.id }.count
  end

  def renewal_data_by_date(date, subscriptions)
    current_month_subscriptions = in_period_subscriptions(subscriptions, date.beginning_of_month..date.end_of_month, 'ACTIVE')
    renewed_subscriptions = current_month_subscriptions.sum { |subscription| subscription.node.orders.edges.count > 1 && (orders_in_range(subscription).size > 1) ? 1 : 0  }
    renewed_subscriptions / current_month_subscriptions.count rescue 0
  end

  def in_period_subscriptions(subscriptions, range, status = nil)
    subscriptions.select { |subscription| range.cover?(subscription.node.created_at.to_date) && (status ? subscription.node.status == status : true) }
  end

  def orders_in_range(subscription)
    subscription.node.orders.edges.select { |order| date.beginning_of_month..date.end_of_month.cover?(order.node.created_at.to_date) }
  end

  # Revenue Trends
  def get_total_sales(range = nil)
    @orders = range.nil? ? @orders : @orders.select {|order| range.cover?(order.created_at.to_date) }
    @orders.sum { |order| order.current_total_price_set.presentment_money.amount.to_f } + @orders.sum { |order| order.total_shipping_price_set.presentment_money.amount.to_f }.round(2)
  end

  def charge_count(range)
    @orders.sum {|order| range.cover?(order.created_at.to_date) ? 1 : 0 }
  end

  def recurring_sales
    ((@subscriptions.sum { |subscription| get_orders_total_amount(subscription) } / get_total_sales) * 100).to_f.round(2)
  end

  def sales_per_charge
    @subscriptions.sum { |subscription| get_orders_total_amount(subscription) } / orders_count
  end

  def orders_count
    @subscriptions.sum { |subscription| subscription.node.orders.edges.count }
  end

  def total_refunds(range = nil)
    @subscriptions = range.nil? ? @subscriptions : in_period_subscriptions(@subscriptions, range)
    refunded_amount(@subscriptions)
  end

  def checkout_charge(range = nil)
    @subscriptions = range.nil? ? @subscriptions : in_period_subscriptions(@subscriptions, range)
    @subscriptions.sum{ |subscription| subscription.node.orders.edges.count == 1 ? get_orders_total_amount(subscription) : 0.0 } / orders_count rescue 0
  end

  def recurring_charge(range = nil)
    @subscriptions = range.nil? ? @subscriptions : in_period_subscriptions(@subscriptions, range)
    @subscriptions.sum{ |subscription| subscription.node.orders.edges.count > 1 ? get_orders_total_amount(subscription) : 0.0 } / orders_count rescue 0
  end

  def new_customers
    @subscriptions.group_by{ |subscription| subscription.node.customer.id }.sum { |data| data[1].count == 1 ? 1 : 0 }
  end

  def churn_rate(range)
    range.count * get_churn_rate(@subscriptions, range)
  end

  def graph_data_by_granularity(method)
    @range.map(&"beginning_of_#{@granularity.downcase}".to_sym).uniq.map do |date|
      {
        date: date.strftime(@granularity == 'year' ? '%Y' : '%b %d'),
        data: send(method, date.instance_eval("beginning_of_#{@granularity}")..date.instance_eval("end_of_#{@granularity}"))
      }
    end
  end

  def active_vs_churned_data(range)
    {
      active_customers: in_period_subscriptions(@subscriptions, range, 'ACTIVE').count,
      churned_customers: in_period_subscriptions(@subscriptions, range, 'CANCELLED').count
    }
  end

  def total_sales_data(range)
    {
      value: get_total_sales(range),
      charge_count: charge_count(range)
    }
  end

  def refunds_data(range)
    {
      value: total_refunds(range),
      refunds_count: @subscriptions.sum { |subscription| subscription.node.orders.edges.sum { |order| order.node.total_refunded_set.presentment_money.amount.to_f > 0 ? 1 : 0  } }
    }
  end

  def active_customers_data(range)
    { value: customers_in_range(range) }
  end

  def customers_in_range(range)
    subscriptions = in_period_subscriptions(@subscriptions, range, 'ACTIVE')
    subscriptions.group_by { |subscription| subscription.node.customer.id }.count
  end

  def new_vs_cancelled_data(range)
    { active_subscriptions_count: in_period_subscriptions(@subscriptions, range, 'ACTIVE').count, cancelled_subscriptions_count: in_period_subscriptions(@subscriptions, range, 'CANCELLED').count }
  end

  def get_upcoming_revenue(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? get_orders_total_amount(subscription) : 0 }.to_f.round(2)
  end

  def get_upcoming_historical_revenue(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? subscription.node.orders.edges.sum { |order| order.node.original_total_price_set.presentment_money.amount.to_f } : 0 }.to_f.round(2)
  end

  def get_upcoming_error_revenue(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? subscription.node.orders.edges.sum { |order| calculated_error_revenue(order) } : 0}.to_f.round(2)
  end

  def calculated_error_revenue(order)
    order.node.transactions.sum{ |transaction| transaction.status == 'ERROR' ? transaction.amount_set.presentment_money.amount.to_f : 0 }
  end

  def get_upcoming_charge(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? 1 : 0 }
  end

  def recurring_vs_checkout_data(range)
    {
      recurring_sales: recurring_charge(range),
      one_time_sales: checkout_charge(range)
    }
  end

  def get_upcoming_error_charges(day_count)
    @subscriptions.sum { |subscription| (Date.today..Date.today + day_count.days).cover?(subscription.node.next_billing_date) ? error_transactions_count(subscription) : 0 }
  end

  def error_transactions_count
    subscription.node.orders.edges.sum { |order| order.node.transactions.sum { |transaction| transaction.status == 'ERROR' ? 1 : 0 } }
  end
end
