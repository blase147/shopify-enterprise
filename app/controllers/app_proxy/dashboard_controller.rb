class AppProxy::DashboardController < AppProxyController
  before_action :load_subscriptions
  before_action :load_customer, only: %w(addresses payment_methods settings)
  def index
  end

  def subscription; end
  def upcoming; end
  def order_history; end
  
  def addresses
    
  end
  
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
    @data = CustomerSubscriptionContractsService.new(shopify_customer_id).run
    @subscription_contracts = @data[:subscriptions] || []
  end
end