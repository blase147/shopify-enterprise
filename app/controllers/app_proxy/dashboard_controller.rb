class AppProxy::DashboardController < AppProxyController
  before_action :load_subscriptions
  before_action :load_customer, only: %w(index addresses payment_methods settings)
  def index
    products = ProductService.new.list
    @swap_products = products.is_a?(Hash) ? nil : products.select{ |p| p.node.selling_plan_group_count > 0 }
  end

  def subscription; end

  def upcoming; end

  def order_history; end

  def addresses; end

  def payment_methods
    @orders = ShopifyAPI::Order.find(:all,
      params: { customer_id: customer_id, limit: PER_PAGE, page_info: params[:page_info] }
    )


    @payment_methods = {}
    @orders.each do |order|
      @payment_methods[order.payment_details.credit_card_number] = order.payment_details
    end

    @payment_methods = @payment_methods.values
  end

  def settings
  end

  private ##

  def load_customer
    customer_service ||= CustomerService.new({shop: current_shop})
    @customer = customer_service.find(customer_id)
  end

  def load_subscriptions
    @active_subscriptions_count = params[:active_subscriptions_count].to_i
    @data = CustomerSubscriptionContractsService.new(shopify_customer_id).run
    @subscription_contracts = @data[:subscriptions] || []
    @cancelled_subscriptions = @data[:cancelled_subscriptions] || []
    @active_subscriptions = @data[:active_subscriptions] || []
  end
end
