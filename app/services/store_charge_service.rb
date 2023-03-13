class StoreChargeService
  def initialize(shop)
    @shop = shop
    @shop.connect
  end

  def create_recurring_charge(plan)
    recurring_application_charge = ShopifyAPI::RecurringApplicationCharge.new({name: "#{plan.titleize} Subscription Charge", capped_amount: 500000, terms: 'Subscription Item Purchased Charge'})
    recurring_application_charge.price = case plan
    when 'starter'
      0
    when 'pro'
      133
    end
    recurring_application_charge.test = Rails.env.development?
    recurring_application_charge.return_url = "#{ENV['HOST']}subscription/charge"
    recurring_application_charge.save
    @shop.pending_recurring_charges.find_or_initialize_by(charge_id: recurring_application_charge.id&.to_i)&.save
    @shop.update(recurring_charge_id: recurring_application_charge.id)
    recurring_application_charge
  end

  def create_usage_charge(subscription)
    return false unless @shop.recurring_charge_id.present?

    orders = subscription.orders.edges.select { |order| order.node.created_at.to_date == Date.today }
    if orders.present?
      order_price = orders.sum { |o| o.node.total_received_set.presentment_money.amount.to_f }
      price = if @shop.plan == 'freemium'
          (1.25 / 100) * order_price
        elsif @shop.plan == 'platinum'
          (0.97 / 100) * order_price
        end
      if price > 0.5
        usage_charge = ShopifyAPI::UsageCharge.new({ description: 'Subcription Charge', price: price })
        usage_charge.prefix_options[:recurring_application_charge_id] = @shop.recurring_charge_id
        return usage_charge.save ? true : false
      end
    end
  end

  def load_current_recurring_charge
    @recurring_application_charge = ShopifyAPI::RecurringApplicationCharge.current
  end
end
