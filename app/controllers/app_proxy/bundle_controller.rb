class AppProxy::BundleController < AppProxyController
  layout 'application'
  before_action :set_shop, except: %i[update_curvos_bundle]
  before_action :update_contracts, only: :add_product

  def index
    get_bundle_products
    render 'index', content_type: 'application/liquid', layout: 'rebuy_liquid_app_proxy'
  end

  def add_product # needs attention
    customer = @shop.customer_subscription_contracts.order(created_at: :desc).first
    if shopify_customer_id.present? && customer.shopify_customer_id == customer_id && !customer.box_items.present?
      customer.update(box_items: params[:box_products])
    end
  end

  def update_contracts
    CustomerSubscriptionContract.update_contracts(shopify_customer_id, @shop)
  end

  def get_build_a_box
    if params[:selling_plan_ids].present?
      build_a_box = BuildABoxCampaign.joins(:build_a_box_campaign_group).where(
        build_a_box_campaign_groups: { shop_id: @shop.id, location: 'product_page' }
      ).where("selling_plan_ids &&  ?", "{#{params[:selling_plan_ids]}}").first
    else
      build_a_box = false
    end
    if build_a_box
      render json: { success: true, build_a_box_id: build_a_box.id }
    else
      render json: { success: false }
    end
  end

  def curvos_bundle
    get_bundle_products
    render 'curvos_bundle', content_type: 'application/liquid', layout: 'rebuy_liquid_app_proxy'
  end

  def update_curvos_bundle
    variants = params[:variants]&.split(",")
    CurvosModel.find_or_initialize_by(mix_panel_id: params[:mix_panel_id]).update(variants: variants)
    render json:{status: :ok}
  end

  private

  def fetch_products(products)
    product_ids = products.map {|product| product['product_id'][/\d+/]}.join(',')
    @products = ShopifyAPI::Product.where(ids: product_ids, fields: 'id,title,images,variants')
  end

  def set_customer
    @customer = CustomerSubscriptionContract.find_by_shopify_customer_id(customer_id)
  end

  def set_shop
    @shop = Shop.find_by(shopify_domain: params[:shop])
  end

  def get_bundle_products
    if params[:title].present?
      @bundle_menu = BundleMenu.find_by("lower(title) = '#{params[:title].downcase}'")
      # abort(@bundle_menu.shop.to_json)
      shop = @bundle_menu.shop
      shop.connect
      products = @bundle_menu.collection_images&.map{|c| c["products"]}.first || @bundle_menu.product_images 
      products = products&.map{|p| p["product_id"][/\d+/]} rescue []
      free_products = @bundle_menu.free_product_collections&.map{|c| c["products"]}.first || @bundle_menu.free_products_images
      free_products = free_products&.map{|p| p["product_id"][/\d+/]} rescue []
      all_product_ids = products + free_products
      @all_products = ShopifyAPI::Product.where(ids: all_product_ids.join(","),  fields: 'id,title,images,body_html,variants') 
      gon.all_products = @all_products
      @products = @all_products.select{ |product| products.include?("#{product&.id}") }
      @free_products = @all_products.select{|product| free_products.include?("#{product&.id}")}
    end
  end
end

