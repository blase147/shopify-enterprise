class SubscriptionsController < AuthenticatedController
  skip_before_action :verify_authenticity_token
  layout 'subscriptions'
  include SubscriptionConcern

  def sync_stripe
    StripeSubscriptionSyncWorker.perform_async(current_shop.id, false)
    head :no_content
  end

  def index
    redirect_to subscription_path(id: params[:id]) if params[:id].present?

    @data = SubscriptionContractsService.new.all_subscriptions # params[:cursor]
    @subscription_contracts = @data[:subscriptions] || []
  end

  def show
    id = params[:id]
    if params[:local_id]
      @customer = CustomerSubscriptionContract.find_by(id: params[:local_id])
    else
      @customer = CustomerSubscriptionContract.find_by_shopify_id(params[:id])
    end

    if id && !@customer
      ShopifyContractCreateWorker.new.perform(current_shop.id, id)
      @customer = CustomerSubscriptionContract.find_by_shopify_id(id)
    end

    if @customer.api_source != 'stripe' && !@customer.api_data
      @customer.api_source = 'shopify'
      @customer.api_data = SubscriptionContractService.new(id).run.to_h.deep_transform_keys { |key| key.underscore }
      @customer.save
    end

    @subscription = JSON.parse(@customer.api_data.to_json, object_class: OpenStruct)
    @customer&.shop.connect
    products = ProductService.new.list
    @swap_products = products.is_a?(Hash) ? nil : products&.select{ |p| p.node.selling_plan_group_count > 0 }
    @total = @subscription&.orders&.edges&.map { |order|
      order.node.total_received_set.presentment_money.amount.to_f
    }&.sum
    @box_products = ShopifyAPI::Product.where(ids: @customer.box_items, fields: 'id,title,images,variants') if  @customer&.box_items.present?
    unless @box_products
      origin_orders = JSON.parse(@subscription&.origin_order_meals.to_json,  object_class: OpenStruct) rescue [{}]
      product_ids = origin_orders&.map{|e| e.node.custom_attributes.find{|a| a.key == "_box_product_ids"}.value rescue nil}.flatten.compact.join(',') rescue nil
      @box_products = ShopifyAPI::Product.where(ids: product_ids, fields: 'id,title,images,variants') if product_ids.present?
    end

    @translation = current_shop&.translation

    set_associated_data
    render "#{@customer.api_source == 'stripe' ? 'stripe_' : ''}show"
  end

  def set_associated_data
    @pre_orders = WorldfarePreOrder.where(shopify_contract_id: @customer.shopify_id)
    @pre_order_products = @pre_orders.to_h { |pre_order| [pre_order.id, fetch_shopify_products(JSON.parse(pre_order.products))] }
    @billing_attempts = @customer.billing_attempts["edges"] rescue []
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

  def remove_box_item
    @customer = CustomerSubscriptionContract.find_by_shopify_id(params[:id])
    box_items = @customer.box_items.split(',')
    box_items.delete(params[:product_id])
    @customer.update(box_items: box_items.present? ? box_items.join(',') : nil)
    render js: 'location.reload()'
  end

  def fetch_shopify_products(product_ids)
    product_ids = product_ids&.map(&:to_s)
    products = ShopifyAPI::Product.where(ids: product_ids.join(', '), fields: 'id,title')
    quantity = Hash.new(0)
    product_ids&.each do |v|
      quantity[v] += 1
    end
    products_with_quantitiy = []
    products&.each do |p|
      products_with_quantitiy << {title: p&.title , quantity: quantity["#{p&.id}"]}
    end
    products_with_quantitiy
  end

  def update_billing_date
    @customer = CustomerSubscriptionContract.find_by(id: params[:local_id])

    return if params[:date].blank?
    
    result = SetNextBillingDate.new(@customer.shopify_id, params[:date]).run

    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "showToast('error', '#{result[:error]}'); hideLoading()"
    else
      render js: "showToast('notice', 'Updated billing date!'); hideModal();"
    end
  end

  def create_billing_attempt
    id = params["id"].to_i
    CreateBillingAttemptService.new().run(id)
  end

  def update_contract_delivery_date_day
    contract = CustomerSubscriptionContract.find(params[:id])
    delivery_date = params[:date]&.to_date&.strftime("%d/%m/%Y")
    contract&.delivery_date = delivery_date if delivery_date.present?
    contract&.delivery_day = params[:day] if params[:day].present?
    contract.save
    order = ShopifyAPI::Order.find(contract.api_data["origin_order"]["id"]&.split("/")&.last)
    order.note_attributes << { name: "Delivery Date", value: delivery_date } if delivery_date.present?
    order.note_attributes << { name: "Delivery Day", value: params[:day] } if params[:day].present?
    if order.save
      render js:{ success: :true }.to_json
    else
      render js:{ success: :false }.to_json
    end
  end

  def pause
    result = CustomerSubscriptionContract.pause(params)
    if result
      render json:{ success: :true }.to_json
    else
      render :json => { error: result[:error] }
    end
  end

  def cancel
    result = CustomerSubscriptionContract.cancel(params)
    if result
      render json:{ success: :true }.to_json
    else
      render :json => { error: result[:error] }
    end
  end
end
