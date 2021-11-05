class AppProxy::DashboardController < AppProxyController
  before_action :load_subscriptions, except: [:build_a_box, :confirm_box_selection]
  before_action :load_customer, only: %w(index addresses payment_methods settings upcoming build_a_box)

  def index
    products = ProductService.new.list
    @swap_products = products.is_a?(Hash) ? nil : products&.select{ |p| p.node.selling_plan_group_count > 0 }

    render "#{current_setting.portal_theme}index", content_type: 'application/liquid', layout: "#{current_setting.portal_theme}liquid_app_proxy"
  end

  def subscription
    render 'subscription', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def upcoming
    render 'upcoming', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def order_history
    render 'order_history', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def addresses
    render 'addresses', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def payment_methods
    @orders = ShopifyAPI::Order.find(:all,
      params: { customer_id: customer_id, limit: PER_PAGE, page_info: params[:page_info] }
    )


    @payment_methods = {}
    @orders.each do |order|
      @payment_methods[order.payment_details.credit_card_number] = order.payment_details if order.try(:payment_details).present?
    end
    @shopify_customer = CustomerService.new({shop: current_shop}).get_customer(customer_id)
    @payment_methods = @payment_methods.values
    render 'payment_methods', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def settings
    render 'settings', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def build_a_box
    products = nil
    @subscription_id = params[:subscription_id]
    @customer = current_shop.customers.find_by_shopify_id(params[:subscription_id])
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
    customer = current_shop.customers.find_by(shopify_id: params[:subscription_id])
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

  private ##

  def fetch_products(products)
    product_ids = products.map{|product| product['product_id'][/\d+/] unless product["_destroy"]}.compact.join(',')
    @products = ShopifyAPI::Product.where(ids: product_ids, fields: 'id,title,images')
  end

  def load_customer
    Customer.update_contracts(shopify_customer_id, current_shop)
    @customer = current_shop.customers.find_by_shopify_customer_id(customer_id)
  end

  def load_subscriptions
    @data = CustomerSubscriptionContractsService.new(shopify_customer_id).run
    @subscription_contracts = @data && @data[:subscriptions] || []
    @cancelled_subscriptions = @data && @data[:cancelled_subscriptions] || []
    @active_subscriptions = @data && @data[:active_subscriptions] || []
    @active_subscriptions_count = params[:active_subscriptions_count].present? ? params[:active_subscriptions_count].to_i : (@data && @data[:active_subscriptions].count || 0)
    @cancelled_line_items = RemovedSubscriptionLine.where(customer_id: params[:customer_id])
  end
end
