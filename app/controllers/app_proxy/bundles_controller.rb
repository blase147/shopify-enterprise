class AppProxy::BundlesController < AppProxyController

  def get_bundle
    @bundle_group = BundleGroup.find_by(shop_id: current_shop.id, shopify_product_id: params[:product_id])
    if @bundle_group.present?
      render json: { success: true, bundle_group: @bundle_group }
    else
      render json: { success: false }
    end
  end

  def show
    @bundle_group = current_shop.bundle_groups.find(params[:id])
    if @bundle_group
      @bundle = @bundle_group.bundles.find_by(shopify_variant_id: params[:variant_id])
      case @bundle_group&.bundle_type
      when 'collection'
        products = @bundle_group.collection_images[0]['products']
      when 'products'
        products = @bundle_group.product_images
      end
      fetch_products(products) if products.present?
    end
    render 'show', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def fetch_products(products)
    product_ids = products.map {|product| product['productId'][/\d+/]}.join(',')
    @products = ShopifyAPI::Product.where(ids: product_ids, fields: 'id,title,images,variants')
  end

end
