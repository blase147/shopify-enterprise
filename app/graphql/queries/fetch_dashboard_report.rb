module Queries
  class FetchDashboardReport < Queries::BaseQuery
    type Types::DashboardReportType, null: false
    argument :duration, String, required: true

    def resolve(duration:)
      subscriptions = ReportService.new.get_subscriptions
      range = get_date_range(duration)
      subscriptions_in_period = in_period_subscriptions(subscriptions, range)
      current_month_subscriptions = in_period_subscriptions(subscriptions, (Date.today - 1.month..Date.today))
      subcription_month_revenue = current_month_subscriptions.sum { |subscription| get_orders_total_amount(subscription) }
      active_subscriptions_count = get_subscriptions_count(subscriptions, 'ACTIVE')
      churn_rate = get_churn_rate(subscriptions, range)
      customer_lifetime = get_customer_lifetime_value(subscriptions_in_period) / churn_rate rescue 0
      revenue_churn = month_graph_data(subscriptions, range, :revenue_churn_by_date)
      arr_data = year_graph_data(subscriptions, range, :arr_data_by_date)
      mrr_data = month_graph_data(subscriptions, range, :mrr_data_by_date)
      refund_data = month_graph_data(subscriptions, range, :refund_data_by_date)
      sales_data =  month_graph_data(subscriptions, range, :sales_data_by_date)
      active_customers = month_graph_data(subscriptions, range, :get_customers_by_date)
      renewal_data = month_graph_data(subscriptions, range, :renewal_data_by_date)
      { mrr: subcription_month_revenue, active_subscriptions_count: active_subscriptions_count,
        churn_rate: churn_rate, active_customers: active_customers, customer_lifetime_value: customer_lifetime,
        revenue_churn: revenue_churn, arr_data: arr_data, mrr_data: mrr_data, refund_data: refund_data, sales_data: sales_data, renewal_data: renewal_data }
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
      customer_at_period_start = in_period_subscriptions(subscriptions, range.start - 1.year..range.start - 1.day, 'ACTIVE')
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
          data: send(method, date, subscriptions)
        }
      end
    end

    def year_graph_data(subscriptions, range, method)
      range.map(&:beginning_of_year).uniq.map do |date|
        {
          date: date.strftime('%Y'),
          data: send(method, date, subscriptions)
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
      subscriptions.sum { |subscription| subscription.node.orders.edges.sum { |order| order.node.total_refunded_set.presentment_money.amount.to_f } }
    end

    def arr_data_by_date(date, subscriptions)
      current_year_subscriptions = in_period_subscriptions(subscriptions, date.beginning_of_year..date.end_of_year)
      current_year_subscriptions.sum { |subscription| get_orders_total_amount(subscription) }
    end

    def mrr_data_by_date(date, subscriptions)
      current_month_subscriptions = in_period_subscriptions(subscriptions, date.beginning_of_month..date.end_of_month)
      current_month_subscriptions.sum { |subscription| get_orders_total_amount(subscription) }
    end

    def get_orders_total_amount(subscription)
      subscription.node.orders.edges.sum { |order| order.node.total_price_set.presentment_money.amount.to_f }
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
  end
end
