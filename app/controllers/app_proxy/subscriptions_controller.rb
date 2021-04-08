class AppProxy::SubscriptionsController < AppProxyController
  before_action :init_session
  include SubscriptionConcern

  def index
    customer_id = "gid://shopify/Customer/#{params[:customer_id]}"
    @data = CustomerSubscriptionContractsService.new(customer_id).run params[:cursor]
    @subscription_contracts = @data[:subscriptions] || []
  end

  def show
    @subscription = SubscriptionContractService.new(params[:id]).run

    product_id = @subscription.lines.edges.first.node.product_id[/\d+/]
    @product = ShopifyAPI::Product.find(product_id)

    unless params[:customer_id] == @subscription.customer.id[/\d+/]
      redirect_to "/a/chargezen_production/subscriptions/?customer_id=#{params[:customer_id]}"
    end
  end

  def cancel
    id = params[:id]
    result = SubscriptionContractDeleteService.new(id).run

    if result[:error].present?
      render :json => { error: result[:error] }
    else
      render js: "location.reload();"
    end
  end

  def change_bill
    id = params[:id]
    result = CardUpdateService.new(id).run

    if result.is_a?(Hash)
      render :json => { error: result[:error] }
    else
      render :json => { status: :ok, message: "Success", show_notification: true }
    end
  end

  def update_subscription
    if params[:subscription].present?
      date = params[:subscription][:next_billing_date].to_date rescue nil
      if date.nil?
        splitted_date = params[:subscription][:next_billing_date].split('/')
        params[:subscription][:next_billing_date] = [splitted_date[2], splitted_date[0], splitted_date[1]].join('-')
      end
    end
    id = "gid://shopify/SubscriptionContract/#{params[:id]}"
    result = SubscriptionContractUpdateService.new(id).run params

    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: "location.reload();"
    end
  end

  def apply_discount
    redeem_code = params[:redeem_code]
    result = SubscriptionDraftsService.new.apply_discount(@draft_id, redeem_code)
    SubscriptionDraftsService.new.commit @draft_id
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
    end
  end
end
