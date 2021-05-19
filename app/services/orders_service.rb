class OrdersService
  def initialize shop
    @shop = shop
    init_session
  end

  def orders_in_range(range_start, range_end, fields = nil)
    limit = 250
    all_orders = []
    orders = ShopifyAPI::Order.find(:all, params: { status: 'any', limit: limit, created_at_min: range_start, created_at_max: range_end, since_id: 0, fields: fields })

    all_orders = all_orders.concat orders
    puts orders.length
    while orders.length == limit
      since_id = orders.last.id
      orders = ShopifyAPI::Order.find(:all, params: { limit: limit, since_id: since_id, fields: fields })
      all_orders = all_orders.concat orders
    end
    all_orders
  rescue Exception => ex
    { ex: ex.message }
  end

  def init_session
    @shop.connect
  end
end
