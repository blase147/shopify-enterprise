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
    current_shop.connect
    @payment_method = SubscriptionContractService.new(@customer.shopify_id).get_subscription_payment_method
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
    customer = CustomerSubscriptionContract.find id rescue nil
    if customer.present?
      customer.shop.connect
      subscription_id = customer&.shopify_id
      subscription = ReportService.new.get_single_subscriptions(subscription_id)
      result = CreateBillingAttemptService.new().run(id)
      while result[:error].nil? && result[:data]&.ready == false
        billing = SubscriptionBillingAttempService.new(subscription.id).get_attempt(result[:data]&.id)
        result[:error] = billing[:error] rescue nil
        result[:data] = billing.data.subscription_billing_attempt rescue (result[:error] = billing[:error])
      end 
      if result[:error].present?
        customer.update_columns(failed_at: Time.current)
        description = "Billing attempt failed for #{customer&.subscription} subscription. Subscription Id :- #{subscription_id}. Error :- #{result[:error]}"
        SubscriptionLog.create(description: description, billing_status: :failure, executions: (customer.shop.setting.payment_retries.to_i>0 ? true : false), customer_id: customer.id, shop_id: customer.shop_id, subscription_id: subscription_id, action_by: 'admin')
        # send failed transaction email
        email_notification = customer.shop.setting.email_notifications.find_by_name "Card declined"
        EmailService::Send.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
        render json:{error: true}
      else
        CreateBillingAttemptService.charge_store(result[:data].id, subscription_id, customer.shop)
        description = "Billing attempt successfull for #{customer&.subscription} subscription. Subscription Id :- #{subscription_id}"
        SubscriptionLog.create(description: description, billing_status: :success, customer_id: customer.id, shop_id: customer.shop_id, subscription_id: subscription_id, action_by: 'admin')
        email_notification = customer.shop.setting.email_notifications.find_by_name "Recurring Charge Confirmation"
        EmailService::Send.new(email_notification).send_email({customer: customer, line_name: subscription.lines.edges.collect{|c| c.node.title}.to_sentence}) unless email_notification.nil?
        render json:{success: true}
      end
    end
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

  def fetch_customers_from_shopify
    current_shop.connect
    @customers = FetchWithQueryFromShopify.new.fetch_customers(params[:query])
    render json:{ status: :ok, customers: @customers}.to_json
  end

  def customer_migration
    params[:sellingplangroup] = SellingPlan.find_by_shopify_id(params[:sellingplan])&.selling_plan_group&.shopify_id
    @error = nil
    if params[:data][:payment_method] == "stripe"
      customer = CustomerModal.find_by_shopify_id(params[:customer_id][/\d+/])
      @stripe_customer = Stripe::Customer.list({email: customer&.email}, api_key: current_shop.stripe_api_key).data[0] rescue nil
      if @stripe_customer.present?
        AddStripeCustomerMigration.create(raw_data: params.to_json, customer_id: params[:customer_id][/\d+/]&.to_i)
        CustomerService.new({shop: current_shop}).create_customer_payment_remote_method(@stripe_customer&.id, params[:customer_id])
      else
        @error ="This customer doesn't have stripe account"
      end
    else
      contract = SubscriptionContractDraftService.new(params).fetch_customer
    end
    if @error.present?
      render json:{error: :true, response: @error}.to_json
    else
      render json:{status: :ok, response: "Your request is beign processed. Reloading..."}.to_json
    end
  end

  def import_customer_migrations
    current_shop.connect
    ImportCustomerMigrationWorker.perform_async(current_shop&.id, params.to_json)
    render json:{status: :ok, response: "Migration started"}.to_json
  end
end
