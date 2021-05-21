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

  def month_graph_data(method)
    @range.map(&:beginning_of_month).uniq.map do |date|
      {
        date: date.strftime('%b %d'),
        data: send(method, date)
      }
    end
  end

  def active_vs_churned_skip_data(date)
    range = date.beginning_of_month..date.end_of_month
    {
      active_customers: customers_count('ACTIVE', :skip, range),
      churned_customers: customers_count('CANCELLED', :skip, range)
    }
  end

  def active_vs_churned_swap_data(date)
    range = date.beginning_of_month..date.end_of_month
    {
      active_customers: customers_count('ACTIVE', :swap, range),
      churned_customers: customers_count('CANCELLED', :swap, range)
    }
  end

  def customers_count(status, action, range)
    @shop.customers.joins(:subscription_logs)
         .where(customers: { status: status }, subscription_logs: { action_type: action })
         .where('subscription_logs.created_at::date BETWEEN ? AND ?', range.first, range.last).count
  end

  def sales_per_charge
    @subscriptions.sum { |subscription| get_orders_total_amount(subscription) } / orders_count rescue 0
  end

  def charge_per_customer
    @subscriptions.sum { |subscription| get_orders_total_amount(subscription) } / sub_customers_count rescue 0
  end

  def orders_count
    @subscriptions.sum { |subscription| subscription.node.orders.edges.count }
  end

  def sub_customers_count
    @subscriptions.group_by { |subscription| subscription.node.customer.id }.count
  end

  def churn_rate
    customer_at_period_start = in_period_subscriptions(@subscriptions, @range.first - 1.year..@range.first - 1.day, 'ACTIVE').count
    cancelled_customer_in_period = in_period_subscriptions(@subscriptions, @range, 'CANCELLED').count
    (cancelled_customer_in_period * 100) / customer_at_period_start rescue 0
  end

  def in_period_subscriptions(subscriptions, range, status = nil)
    subscriptions.select { |subscription| range.cover?(subscription.node.created_at.to_date) && (status ? subscription.node.status == status : true) }
  end

  def get_orders_total_amount(subscription)
    subscription.node.orders.edges.sum { |order| order.node.total_price_set.presentment_money.amount.to_f.round(2) }
  end
end
