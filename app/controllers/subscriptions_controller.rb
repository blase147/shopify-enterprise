class SubscriptionsController < AuthenticatedController
  skip_before_action :verify_authenticity_token
  layout 'subscriptions'

  def index
    redirect_to subscription_path(id: params[:id]) if params[:id].present?

    @data = SubscriptionContractsService.new.run params[:cursor]
    @subscription_contracts = @data[:subscriptions] || []
  end

  def show
    id = params[:id]

    @subscription = SubscriptionContractService.new(id).run

    @total = @subscription.orders.edges.map { |order|
      order.node.total_received_set.presentment_money.amount.to_f
    }.sum

    @customer = @subscription.customer
  end

  def update_customer
    result = CustomerService.new({shop: current_shop}).update params
    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "showToast('error', '#{result[:error]}'); hideLoading()"
    else
      render js: "showToast('notice', 'Customer is updated!'); hideModal();"
    end
  end

  def update_subscription
    id = params[:id]
    result = SubscriptionContractUpdateService.new(id).run params

    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "showToast('error', '#{result[:error]}'); hideLoading()"
    else
      render js: "showToast('notice', 'Subscription is updated!'); hideModal();"
    end
  end

  def send_update_card
    id = params[:id]
    result = CardUpdateService.new(id).run

    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "showToast('error', '#{result[:error]}'); hideLoading()"
    else
      render js: "showToast('notice', 'Update card link is sent!'); hideModal();"
    end
  end

  def remove_card
    id = params[:id]
    result = CardRemoveService.new(id).run

    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "showToast('error', '#{result[:error]}'); hideLoading()"
    else
      render js: "showToast('notice', 'Card is removed!'); hideModal();"
    end
  end

  def skip_schedule
    id = params[:id]
    result = ScheduleSkipService.new(id).run

    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "showToast('error', '#{result[:error]}'); hideLoading()"
    else
      render js: "showToast('notice', 'Next schedule is skipped!'); hideModal();"
    end
  end

  def destroy
    id = params[:id]
    result = SubscriptionContractDeleteService.new(id).run
    p result
    
    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "showToast('error', '#{result[:error]}'); hideLoading()"
    else
      render js: "showToast('notice', 'Subscription is cancelled!'); hideModal();"
    end
  end
end