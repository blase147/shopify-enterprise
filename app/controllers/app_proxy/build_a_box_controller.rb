class AppProxy::BuildABoxController < AppProxyController
  layout 'application'
  before_action :set_customer

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

  private

  def fetch_products(products)
    product_ids = products.map {|product| product['product_id'][/\d+/]}.join(',')
    @products = ShopifyAPI::Product.where(ids: product_ids)
  end

  def set_customer
    @customer = Customer.find_by_shopify_id(customer_id)
  end
end
