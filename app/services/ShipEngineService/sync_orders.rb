class ShipEngineService::SyncOrders
  def initialize(shop)
    @shop = shop
    @shop.connect
  end

  def sync
    orders = OrdersService.new(@shop).orders_in_range(Date.today - 4.years, Date.today, 'id,created_at,order_number,line_items,total_price_set,total_shipping_price_set,subtotal_price_set,total_tax_set,customer,shipping_address,financial_status,fulfillment_status,cancelled_at')
    result = SubscriptionContractsService.new.all_subscriptions
    subscriptions = result[:subscriptions] || []
    orders.each do |order|
      subscription = subscriptions.select{ |sub| sub.node.orders.edges.any? {|o| o.node.id[/\d+/] == order.id.to_s} }
      sales_order_data = order_data(order)
      if subscription.present?
        subscription_node = subscription.first.node
        upcoming_shipping_date = get_upcoming_shipping_date(subscription_node, @shop)
        sales_order_data['due_date'] = upcoming_shipping_date.present? ? upcoming_shipping_date : order.created_at.to_datetime
        sales_order_data['shipping_interval'] = subscription_node.delivery_policy.interval
        sales_order_data['shipping_interval_count'] = subscription_node.delivery_policy.interval_count.to_i
      end
      unless @shop.ship_engine_orders.find_by(order_id: order.id).present?
        @shop.ship_engine_orders.create(sales_order_data)
      end
    end
  rescue StandardError => e
    puts "ERROR: #{e.message}"
  end

  def order_data(order)
    {
      "order_id": order.id.to_s,
      "order_date": order.created_at,
      "order_status": {
        "payment_status": order.financial_status,
        "fulfillment_status": order.fulfillment_status,
        "is_cancelled": order.cancelled_at.present?
      },
      "payment_details": {
        "subtotal_amount": order.subtotal_price_set.presentment_money.amount.to_f,
        "shipping_amount": order.total_shipping_price_set.presentment_money.amount.to_f,
        "tax": order.total_tax_set.presentment_money.amount.to_f,
        "grand_total": order.total_price_set.presentment_money.amount.to_f
      },
      "customer": {
        "name": order.customer.first_name,
        "phone": order.customer.phone,
        "email": order.customer.email
      },
      "ship_to": {
        "name": order.shipping_address.first_name,
        "phone": order.shipping_address.phone,
        "address1": order.shipping_address.address1,
        "city": order.shipping_address.city,
        "state": order.shipping_address.province,
        "zip": order.shipping_address.zip,
        "country_code": order.shipping_address.country_code
      },
      "order_items": sale_order_items_data(order)
    }
  end

  def sale_order_items_data(order)
    data = []
    order.line_items.each do |line_item|
      item_hash = {
        "name": line_item.name,
        "sku": line_item.sku,
        "unit_price": line_item.price_set.presentment_money.amount,
        "quantity": line_item.quantity,
        "grams": (line_item.grams * 0.00220462).to_f.round(2)
      }
      data.push(item_hash)
    end
    data
  end

  def get_upcoming_shipping_date(subscription, shop)
    selling_plan_id = subscription.to_h.dig('lines', 'edges', 0, 'node', 'sellingPlanId')
    return false unless selling_plan_id.present?

    selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: shop.id }).find_by(shopify_id: selling_plan_id)
    if selling_plan.present? && selling_plan.shipping_dates.present?
      selling_plan.billing_dates.select{ |plan| plan.to_date > Date.today }.sort.first
    end
  end
end
