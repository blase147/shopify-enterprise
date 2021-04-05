class AppProxy::OrdersController < AppProxyController

  def index
    @active_subscriptions_count = params[:active_subscriptions_count].to_i
    @orders = ShopifyAPI::Order.find(:all,
      params: { customer_id: customer_id, limit: PER_PAGE, page_info: params[:page_info] }
    )
  end

  def show
    @order = ShopifyAPI::Order.find(params[:id])
  end
end
