class AppProxy::SubscriptionsController < AppProxyController
  before_action :init_session
  before_action :set_draft_contract, only: [:add_product, :update_quantity, :apply_discount, :update_shiping_detail, :swap_product, :remove_line]

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

  def pause
    id = params[:id]
    result = SubscriptionContractDeleteService.new(id).run 'PAUSED'

    if result.is_a?(Hash)
      render :json => { error: result[:error] }
    else
      render :json => { status: :ok, message: "Success" }
    end
  end

  def resume
    id = params[:id]
    result = SubscriptionContractDeleteService.new(id).run 'ACTIVE'

    if result[:error].present?
      render :json => { error: result[:error] }
    else
      render js: "location.reload();"
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

  def add_product
    variant = ShopifyAPI::Variant.find(params[:variant_id])
    product = ProductService.new(variant.product_id).run
    if product&.selling_plan_group_count&.positive?
      result = SubscriptionDraftsService.new.add_line(@draft_id, { 'productVariantId': "gid://shopify/ProductVariant/#{params[:variant_id]}", 'quantity': params[:quantity].to_i.zero? ? 1 : params[:quantity].to_i, 'currentPrice': variant.price })
      render js: "alert('#{result[:error]}'); hideLoading()" if result[:error].present?
      SubscriptionDraftsService.new.commit @draft_id
      RemovedSubscriptionLine.find(params[:line_item_id]).destroy if params[:line_item_id].present?
      render js: 'location.reload()' if result.present?
    else
      render js: "window.top.location.href = '/cart/#{variant.id}:1';"
    end
  end

  def update_quantity
    line_item_id = params[:line_item_id]
    result = SubscriptionDraftsService.new.line_update(@draft_id, line_item_id, { quantity: params[:quantity].to_i })
    SubscriptionDraftsService.new.commit @draft_id
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
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

  def update_shiping_detail
    input = { deliveryMethod: { shipping: {address: params[:address].permit!.to_h.except(:id) } } }
    result = SubscriptionDraftsService.new.update @draft_id, input
    SubscriptionDraftsService.new.commit @draft_id
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
    end
  end

  def swap_product
    result = SubscriptionDraftsService.new.line_update @draft_id, params[:line_id], { 'productVariantId': params[:variant_id], 'quantity': 1, 'currentPrice': params[:variant_price] }
    SubscriptionDraftsService.new.commit @draft_id
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
    end
  end

  def remove_line
    if params[:lines_count].to_i > 1
      result = SubscriptionDraftsService.new.remove(@draft_id, params[:line_id])
      RemovedSubscriptionLine.create(subscription_id: params[:id], customer_id: params[:customer_id], variant_id: params[:variant_id], quantity: params[:quantity] )
    else
      result = SubscriptionContractDeleteService.new(params[:id]).run
    end
    if result[:error].present?
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      SubscriptionDraftsService.new.commit @draft_id
      render js: 'location.reload()'
    end
  end

  def set_draft_contract
    contract_id = "gid://shopify/SubscriptionContract/#{params[:id]}"
    result = SubscriptionContractUpdateService.new(contract_id).get_draft params
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      @draft_id = result[:draft_id]
    end
  end
end
