class AppProxy::DashboardController < AppProxyController
  skip_before_action :init_session, only: [:index, :fetch_contract]
  skip_before_action :set_skip_auth, only: [:fetch_contract]
  before_action :load_subscriptions, except: [:build_a_box, :confirm_box_selection, :index, :fetch_contract, :show_order]
  before_action :load_customer, only: %w(addresses payment_methods settings upcoming build_a_box track_order)
  def index
    if params[:status].present?
      @subscription_contracts = CustomerSubscriptionContract.where(shopify_customer_id: params[:customer_id], status: params[:status]&.upcase)
    else
      @subscription_contracts = CustomerSubscriptionContract.where(shopify_customer_id: params[:customer_id])
    end
    email = @subscription_contracts&.last&.email
    $redis = Redis.new
    @auth = $redis.get("#{email}_auth")
    render "#{current_setting.portal_theme}index", content_type: 'application/liquid', layout: "#{current_setting.portal_theme}liquid_app_proxy"
  end

  def subscription
    render 'subscription', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def upcoming
    # @skip_auth = Rails.env.development? || params[:pwd] == 'craycray'
    render 'upcoming', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def track_order
    render 'track_order', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def order_history
    render 'order_history', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def addresses
    render 'addresses', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def payment_methods(customer_id=nil)
    params[:customer_id] = customer_id if customer_id.present?
    @orders = ShopifyAPI::Order.find(:all,
      params: { customer_id: params[:customer_id], limit: 6, page_info: nil }
    )

    @payment_methods = {}
    @orders.each do |order|
      @payment_methods[order.payment_details.credit_card_number] = order.payment_details if order.try(:payment_details).present?
    end
    @shopify_customer = CustomerService.new({shop: current_shop}).get_customer(customer_id)
    @payment_methods = @payment_methods.values
    @payment_type = :SHOPIFY.to_s
    if @payment_methods.empty? && current_shop.stripe_api_key.present?
      @current_shop = current_shop
      @payment_type = :STRIPE.to_s
      @stripe_customer = Stripe::Customer.list({}, api_key: current_shop.stripe_api_key).data.filter{|c| c.email == @shopify_customer.email}[0]
      @stripe_card_info = []
      unless @stripe_customer.nil?
        stripe_card = Stripe::Customer.retrieve_source(@stripe_customer.id, @stripe_customer.default_source, api_key: current_shop.stripe_api_key)
        begin
          @stripe_card_info = stripe_card.card
        rescue => e
          puts e
        end

        @stripe_card_owner = stripe_card&.owner
      end
    end
    render 'payment_methods', content_type: 'application/liquid', layout: 'liquid_app_proxy' if customer_id.nil?
  end

  def update_stripe_source
    Stripe::Customer.create_source(params[:stripe_customer_id],{ source: params[:source]}, api_key: current_shop.stripe_api_key)
    Stripe::Customer.update( params[:stripe_customer_id], {default_source: params[:source]}, api_key: current_shop.stripe_api_key)
    render :json => { status: :ok, message: "Success", show_notification: true }
  end

  # worldfare
  def pre_order
    sub_pre_order = WorldfarePreOrder.find_by(customer_id: params[:customer_id], week: params[:week])
    if sub_pre_order.nil?
      sub_pre_order = WorldfarePreOrder.create(shop_id: current_shop.id, customer_id: params[:customer_id], week: params[:week], products: params[:products])
    else
      sub_pre_order.update( products: params[:products] )
    end
    sub_pre_order.save
    render json: { status: :ok, customer_id: params[:customer_id], message: 'Success', show_notification: true }
  end

  def settings
    render 'settings', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def build_a_box
    # @skip_auth = Rails.env.development? || params[:pwd] == 'craycray'
    products = nil
    @subscription_id = params[:subscription_id]
    if params[:stripe_subscription]
      @customer = current_shop.customer_subscription_contracts.find_by_id(params[:subscription_id])
    else
      @customer = current_shop.customer_subscription_contracts.find_by_shopify_id(params[:subscription_id])
    end

    if params[:selling_plan_id].present?
      @selling_plan_id = params[:selling_plan_id]
      @box_campaign = BuildABoxCampaign.find(params[:build_a_box_campaign_id]) # current_shop.build_a_box_campaign_groups.last.build_a_box_campaign
      @selected_products = ShopifyAPI::Product.where(ids: @customer.box_items, fields: 'id,title,images') if @customer.box_items.present?
      case @box_campaign&.box_subscription_type
      when 'collection'
        products = @box_campaign.collection_images.map{|ci| ci['products'] unless ci['_destroy']}.flatten.compact
      when 'products'
        products = @box_campaign.product_images
      end
      fetch_products(products) if products.present?
    end
    render 'build_a_box', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def confirm_box_selection
    customer = current_shop.customer_subscription_contracts.find_by(shopify_id: params[:subscription_id]) || current_shop.customer_subscription_contracts.find_by(id: params[:subscription_id])
    customer.update(box_items: params[:product_id], campaign_date: Time.current)
    begin
      contract = SubscriptionContractService.new(customer.shopify_id).run
      order = ShopifyAPI::Order.find contract.origin_order.id[/\d+/]
      order.tags = ShopifyAPI::Product.where(ids: params[:product_id], fields: 'id,title').map(&:title).join(', ')
      order.save
    rescue => e
      puts e
    end
  end

  def get_delivery_option
    if current_shop.present? && current_shop.id.present?
      options = DeliveryOption.find_by(shop_id: current_shop.id)&.api_response
    else
      options = DeliveryOption.find_by(shop_id: params[:shop_id])&.api_response
    end
    link = ''
    begin
      customer_id = "gid://shopify/Customer/#{params[:customer_id]}"
      @data = CustomerSubscriptionContractsService.new(customer_id).run params[:cursor]
      @subscription_contracts = @data[:subscriptions]
      # @customer = CustomerSubscriptionContract.find_by(shopify_customer_id: params[:customer_id])
      # if @customer.nil? && params[:subscription_id].present?
      #   ShopifyContractCreateWorker.new.perform(current_shop.id, params[:subscription_id])
      #   @customer = CustomerSubscriptionContract.find_by_shopify_id(params[:subscription_id])
      # end
      # if @customer.api_source != 'stripe' && !@customer.api_data
      #   @customer.api_source = 'shopify'
      #   @customer.api_data = SubscriptionContractService.new(id).run.to_h.deep_transform_keys { |key| key.underscore }
      #   @customer.save
      # end
      # @subscription = JSON.parse(@customer.api_data.to_json, object_class: OpenStruct)
      # billing_policy = @subscription.billing_policy
      # #billing_date=#{billing_date}&
      # link = action_subscription_contract_path(:skip_schedule, @subscription.id[/\d+/], "billing_interval=#{billing_policy.interval}&billing_interval_count=#{billing_policy.interval_count}")
    rescue => e
      p 'Exception: '
      p e
    end
    render json: { status: :ok, options: options, skip_link: link, s: @subscription_contracts.present? ? @subscription_contracts : []}
  end

  def submit_delivery_option
    current_shop.connect
    if params[:order_id].present?
      order = ShopifyAPI::Order.find(params[:order_id]) rescue nil
      if order.present?
        order.note = params[:note]
        order.save
      end
    end
    render json: { status: :ok, options: (order.nil? ? [] : order)}
  end

  def update_theme
    current_setting.update(portal_theme: params[:theme_name])
  end

  def customer_info
   
    shopify_customer = ShopifyAPI::Customer.find( params[:customer_id] )
    shopify_customer.first_name = params[:first_name]
    shopify_customer.last_name = params[:last_name]
    shopify_customer.addresses << {
      first_name: params[:first_name],
      last_name: params[:last_name],
      address1: params[:address1],
      address2: params[:address2],
      city: params[:city],
      province: params[:state],
      country: params[:country],
      zip: params[:zip],
      default: true
    }
    shopify_customer.save
    render json: { status: :ok, message: 'Success', show_notification: true, saved: shopify_customer.save }
  end

  def create_pre_order
    pre_order = WorldfarePreOrder.find_by(shopify_contract_id: params[:shopify_contract_id], customer_id: params[:customer_id], week: params[:week])
    if pre_order.nil?
      pre_order = WorldfarePreOrder.new(shopify_contract_id: params[:shopify_contract_id], shop_id: current_shop.id, customer_id: params[:customer_id], week: params[:week], products: params[:product_ids], created_by: WorldfarePreOrder::CREATION_TYPES[:customer])
    end
    if pre_order.persisted?
      pre_order.products = params[:product_ids]
    end
    if pre_order.save
      begin_date = Date.commercial(Date.today&.strftime("%Y")&.to_i,params[:week]&.to_i, 1)&.to_date&.strftime("%d/%m/%Y")
      end_date = Date.commercial(Date.today&.to_date&.strftime("%Y")&.to_i,params[:week]&.to_i, 7)&.to_date&.strftime("%d/%m/%Y")
      description = "Selected meals for #{begin_date} - #{end_date} week"
      contract=CustomerSubscriptionContract.find_by_shopify_id(params[:shopify_contract_id]) rescue nil
      contract&.shop&.subscription_logs&.cancel&.create(subscription_id: contract&.shopify_id,customer_id: contract.id, description: description, action_by: 'customer',action_type: "meal_selection")
      render json: { status: :ok, customer_id: params[:customer_id], message: 'Pre Order created Successfuly', show_notification: true }
    else
      render json: { customer_id: params[:customer_id], message: pre_order.errors.full_messages, show_notification: true }
    end
  end

  def fetch_contract
    @translation = current_shop&.translation
    @theme = "#{current_setting.portal_theme}"
    if params[:local_id].present?
      @customer = CustomerSubscriptionContract.find(params[:local_id])
    else
      if params[:status].present?
        @customer = CustomerSubscriptionContract.where(shopify_customer_id: "#{params[:customer_id]}", status: params[:status]&.upcase).first
      end
      if @customer.nil?
        @customer = CustomerSubscriptionContract.where(shopify_customer_id: "#{params[:customer_id]}").first
      end
    end
    current_shop.connect
    @orders = ShopifyAPI::Order.find(:all,
      params: { customer_id: customer_id, limit: PER_PAGE, page_info: params[:page_info] }
    )

    if @customer.present?
      @customer&.shop&.connect
      load_subscriptions(@customer&.shopify_customer_id)
      @api_data = @customer.api_data
      set_delivery_dates
      products = ProductService.new.list
      @swap_products = products.is_a?(Hash) ? nil : products&.select{ |p| p.node.selling_plan_group_count > 0 }
      @subscription_paused = @customer.status ==  "PAUSED"
      payment_methods(@customer.shopify_customer_id)
    end
  end

  def show_order
    current_shop.connect
    @order = ShopifyAPI::Order.find(params[:id]&.to_i)
    respond_to do |format|
      format.js
    end
  end

  def order_paginate
    @orders = ShopifyAPI::Order.find(:all,
      params: { customer_id: params[:customer_id], limit: PER_PAGE, page_info: params[:page_info] }
    )
    respond_to do |format|
      format.js
    end
  end

  def set_delivery_dates
    @delivery_dates = CalculateOrderDelivery.new(@customer, @current_shop.id).calculate_for_customer_portal
    @current_week_select_by = @delivery_dates[:current_week_select_by]
    @current_week_expected_delivery = @delivery_dates[:current_week_expected_delivery]
    @next_week_select_by = @delivery_dates[:next_week_select_by]
    @next_week_expected_delivery = @delivery_dates[:next_week_expected_delivery]
    @no_data_message = "No delivery this week"
  end

  def update_delivery_day
    if params[:delivery_day] && params[:contract_id]
      contract = CustomerSubscriptionContract.find params[:contract_id]
      contract.delivery_day = params[:delivery_day]
      contract.save
    end
  end

  def portal_skip_schedule
    billing_date = DateTime.parse(params[:billing_date])
    skip_billing_offset = params[:billing_interval_count].to_i.send(params[:billing_interval].downcase)
    result = ScheduleSkipService.new(params[:id]).run({ billing_date: billing_date + skip_billing_offset })

    if result[:error].present?
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
    end
  end

  def add_meals 
    @setting = current_shop&.setting
    @customer = CustomerSubscriptionContract.find(params[:local_id])
    params[:customer_id] = @customer.shopify_customer_id
    render "#{current_setting.portal_theme}index", content_type: 'application/liquid', layout: "#{current_setting.portal_theme}liquid_app_proxy"    
  end  
  
  private ##

  def fetch_products(products)
    product_ids = products.map{|product| product['product_id'][/\d+/] unless product["_destroy"]}.compact.join(',')
    @products = ShopifyAPI::Product.where(ids: product_ids, fields: 'id,title,images')
  end

  def load_customer
    # CustomerSubscriptionContract.update_contracts(shopify_customer_id, current_shop)
    @customer = current_shop.customer_subscription_contracts.find_by_shopify_customer_id(customer_id)
  end

  def load_subscriptions(customer_id=nil)
    shopify_customer_id="gid://shopify/Customer/#{customer_id}" if customer_id.present?
    shop = CustomerSubscriptionContract.find_by_shopify_customer_id("#{customer_id}")&.shop
    shop&.connect
    @setting = shop&.setting
    @data = CustomerSubscriptionContractsService.new(shopify_customer_id).run
    @stripe_subscriptions = current_shop.customer_subscription_contracts.where(shopify_customer_id: customer_id, api_source: 'stripe') rescue []
    @subscription_contracts = (@data && @data[:subscriptions] || []) + @stripe_subscriptions
    @paused_subscriptions = (@data && @data[:paused_subscriptions] || []) + @stripe_subscriptions&.select{|lc| lc.status == 'PAUSED'}
    @cancelled_subscriptions = (@data && @data[:cancelled_subscriptions] || []) + @stripe_subscriptions&.select{|lc| lc.status == 'CANCELLED'}
    @active_subscriptions = (@data && @data[:active_subscriptions] || []) + @stripe_subscriptions&.select{|lc| lc.status == 'ACTIVE'}
    @active_subscriptions_count = params[:active_subscriptions_count].present? ? params[:active_subscriptions_count].to_i : (@data && @data[:active_subscriptions].count || 0)
    @cancelled_line_items = RemovedSubscriptionLine.where(customer_id: params[:customer_id])
  end
end
