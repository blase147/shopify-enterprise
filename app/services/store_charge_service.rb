class StoreChargeService
  def initialize(shop)
    @shop = shop
    @shop.connect
  end

  def create_recurring_charge
    load_current_recurring_charge
    @recurring_application_charge.try!(:cancel)
    recurring_application_charge = ShopifyAPI::RecurringApplicationCharge.new({name: 'Subscription Charge', price: 0.00, capped_amount: 500000, terms: 'Subscription Item Purchased Charge'})
    #recurring_application_charge.test = true
    recurring_application_charge.return_url = "#{ENV['HOST']}subscription/charge"
    recurring_application_charge.save

    @shop.update(recurring_charge_id: recurring_application_charge.id, recurring_charge_status: recurring_application_charge.status, charge_confirmation_link: recurring_application_charge.confirmation_url)
  end

  def create_usage_charge(subscription)
    load_current_recurring_charge
    return false unless @recurring_application_charge.present?

    orders = subscription.orders.edges.select { |order| order.node.created_at.to_date == Date.today }
    if orders.present?
      order_price = orders.sum { |o| o.node.total_received_set.presentment_money.amount.to_f }
      price = (2.5 / 100) * order_price
      if price > 0.5
        usage_charge = ShopifyAPI::UsageCharge.new({ description: 'Subcription Charge', price: price })
        usage_charge.prefix_options[:recurring_application_charge_id] = ShopifyAPI::RecurringApplicationCharge.current.id
        return usage_charge.save ? true : false
      end
    end
  end

  def load_current_recurring_charge
    @recurring_application_charge = ShopifyAPI::RecurringApplicationCharge.current
  end
end
