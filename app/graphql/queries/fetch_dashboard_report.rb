module Queries
  class FetchDashboardReport < Queries::BaseQuery
    type Types::DashboardReportType, null: false
    argument :duration, String, required: true

    def resolve(duration:)
      subscriptions = ReportService.new.get_subscriptions
      range = get_date_range(duration)
      subscriptions_in_period = subscriptions.select { |subscription| range.cover?(subscription.node.created_at.to_date) }
      current_month_subscriptions = subscriptions.select { |subscription| (Date.today - 1.month..Date.today).cover?(subscription.node.created_at.to_date) }
      subcription_month_revenue = current_month_subscriptions.sum { |subscription| get_orders_total_amount(subscription) }
      active_subscriptions_count = get_action_subscriptions_count(subscriptions)
      churn_rate = (get_action_subscriptions_count(subscriptions_in_period) * 100) / subscriptions.count
      customer_lifetime = get_customer_lifetime_value(subscriptions_in_period) / churn_rate
      revenue_churn = month_graph_data(subscriptions, range, :revenue_churn_by_date)
      arr_data = year_graph_data(subscriptions, range, :arr_data_by_date)
      mrr_data = month_graph_data(subscriptions, range, :mrr_data_by_date)
      { mrr: subcription_month_revenue, active_subscriptions_count: active_subscriptions_count, churn_rate: churn_rate, active_customers: active_subscriptions_count, customer_lifetime_value: customer_lifetime, revenue_churn: revenue_churn, arr_data: arr_data, mrr_data: mrr_data }
    end

    def get_date_range(duration)
      case duration
      when 'daily'
        Date.today..Date.today
      else
        Date.today - instance_eval(duration.downcase.split(' ').join('.'))..Date.today
      end
    end

    def get_action_subscriptions_count(subscriptions)
      subscriptions.sum { |subscription| subscription.node.status == 'ACTIVE' ? subscription.node.lines.edges.count : 0 }
    end

    def get_customer_lifetime_value(subscriptions)
      customer_data = subscriptions.group_by { |subscription| subscription.node.customer.id }
      customer_data.sum { |data| data[1].sum{ |subscription| subscription.node.orders.edges.sum{ |order| order.node.total_received_set.presentment_money.amount.to_f} } } / customer_data.size
    end

    def month_graph_data(subscriptions, range, method)
      range.map(&:beginning_of_month).uniq.map do |date|
        {
          date: date.strftime('%b %d'),
          data: send(method, date, subscriptions)
        }
      end
    end

    def revenue_churn_by_date(date, subscriptions)
      subscriptions_in_period = subscriptions.select { |subscription| (date.beginning_of_month..date.end_of_month).cover?(subscription.node.created_at.to_date) }
      cancelled_subscriptions_revenue = subscriptions_in_period.sum { |subscription| subscription.node.status == 'CANCELLED' ? get_orders_total_amount(subscription) : 0 }
      order_total = subscriptions_in_period.sum { |subscription| get_orders_total_amount(subscription) }
      (order_total - (order_total - cancelled_subscriptions_revenue)) / order_total
    end

    def year_graph_data(subscriptions, range, method)
      range.map(&:beginning_of_year).uniq.map do |date|
        {
          date: date.strftime('%b %d'),
          data: send(method, date, subscriptions)
        }
      end
    end

    def arr_data_by_date(date, subscriptions)
      current_year_subscriptions = subscriptions.select { |subscription| (date.beginning_of_year..date.end_of_year).cover?(subscription.node.created_at.to_date) }
      current_year_subscriptions.sum { |subscription| get_orders_total_amount(subscription) }
    end

    def mrr_data_by_date(date, subscriptions)
      current_month_subscriptions = subscriptions.select { |subscription| (date.beginning_of_month..date.end_of_month).cover?(subscription.node.created_at.to_date) }
      current_month_subscriptions.sum { |subscription| get_orders_total_amount(subscription) }
    end

    def get_orders_total_amount(subscription)
      subscription.node.orders.edges.sum { |order| order.node.total_received_set.presentment_money.amount.to_f }
    end
  end
end
