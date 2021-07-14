class AppProxy::BuildABoxController < AppProxyController
  layout 'application'
  before_action :set_customer
  before_action :set_shop
  before_action :update_contracts, only: :add_product

  def index
    products = nil
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

  def add_product
    if shopify_customer_id.present? && @shop.customers.last.shopify_customer_id == customer_id
      @shop.customers.last.update(box_items: params[:box_products])
    end
  end

  def set_shop
    @shop = Shop.find_by(shopify_domain: params[:shop])
  end

  def update_contracts
    Customer.update_contracts(shopify_customer_id, @shop)
  end

  private

  def fetch_products(products)
    product_ids = products.map {|product| product['product_id'][/\d+/]}.join(',')
    @products = ShopifyAPI::Product.where(ids: product_ids, fields: 'id,title,images,variants')
  end

  def set_customer
    @customer = Customer.find_by_shopify_customer_id(customer_id)
  end
end
