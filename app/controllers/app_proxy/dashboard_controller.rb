class AppProxy::DashboardController < AppProxyController
  before_action :load_subscriptions, except: [:build_a_box, :confirm_box_selection]
  before_action :load_customer, only: %w(index addresses payment_methods settings upcoming)

  def index
    products = ProductService.new.list
    @swap_products = products.is_a?(Hash) ? nil : products.select{ |p| p.node.selling_plan_group_count > 0 }
  end

  def subscription; end

  def upcoming; end

  def order_history; end

  def addresses; end

  def payment_methods
    @orders = ShopifyAPI::Order.find(:all,
      params: { customer_id: customer_id, limit: PER_PAGE, page_info: params[:page_info] }
    )


    @payment_methods = {}
    @orders.each do |order|
      @payment_methods[order.payment_details.credit_card_number] = order.payment_details if order.try(:payment_details).present?
    end

    @payment_methods = @payment_methods.values
  end

  def settings
  end

  def build_a_box
    products = nil
    @subscription_id = params[:subscription_id]
    if params[:selling_plan_id].present?
      @selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: current_shop.id }).find_by(shopify_id: "gid://shopify/SellingPlan/#{params[:selling_plan_id]}")
      case @selling_plan&.box_subscription_type
      when 'collection'
        products = @selling_plan.collection_images[0]['products']
      when 'products'
        products = @selling_plan.product_images
      end
      fetch_products(products) if products.present?
    end
  end

  def confirm_box_selection
    customer = current_shop.customers.find_by(shopify_id: params[:subscription_id])
    customer.update(box_items: params[:product_id])
  end

  private ##

  def fetch_products(products)
    product_ids = products.map {|product| product['product_id'][/\d+/]}.join(',')
    @products = ShopifyAPI::Product.where(ids: product_ids, fields: 'id,title,images,variants')
  end

  def load_customer
    customer_service ||= CustomerService.new({shop: current_shop})
    @customer = customer_service.find(customer_id)
  end

  def load_subscriptions
    @data = CustomerSubscriptionContractsService.new(shopify_customer_id).run
    @subscription_contracts = @data[:subscriptions] || []
    @cancelled_subscriptions = @data[:cancelled_subscriptions] || []
    @active_subscriptions = @data[:active_subscriptions] || []
    @active_subscriptions_count = params[:active_subscriptions_count].present? ? params[:active_subscriptions_count].to_i : @data[:active_subscriptions].count
    @cancelled_line_items = RemovedSubscriptionLine.where(customer_id: params[:customer_id])
  end
end
