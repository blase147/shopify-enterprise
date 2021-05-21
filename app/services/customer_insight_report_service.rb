class CustomerInsightReportService
  def initialize(shop, range)
    @shop = shop
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
end
