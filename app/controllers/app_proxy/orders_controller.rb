class AppProxy::OrdersController < AppProxyController
  before_action :set_customer
  before_action :set_subscription_count, if: -> { params[:active_subscriptions_count].present? }

  def index
    @orders = ShopifyAPI::Order.find(:all,
      params: { customer_id: customer_id, limit: PER_PAGE, page_info: params[:page_info] }
    )

    render 'index', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def show
    @order = ShopifyAPI::Order.find(params[:id])

    render 'show', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  private

  def set_subscription_count
    @active_subscriptions_count = params[:active_subscriptions_count].to_i
  end

  def set_customer
    @customer = Customer.find_by_shopify_id(customer_id)
  end
end
