class BundleService::ShopifyProduct

  def initialize(bundle_group)
    @bundle_group = bundle_group
  end

  def create
    shopify_product = ShopifyAPI::Product.new
    shopify_product.title = @bundle_group.internal_name

    shopify_product.variants = []
    @bundle_group.bundles.each do |bundle|
      shopify_variant = ShopifyAPI::Variant.new(
        price: (bundle.price_per_item * bundle.quantity_limit),
        option1: bundle.label
      )
      shopify_product.variants << shopify_variant
    end
    if shopify_product.save
      @bundle_group.update(shopify_product_id: shopify_product.id)
      shopify_product.variants.each_with_index do |variant, i|
        @bundle_group.bundles[i].update(shopify_variant_id: variant.id)
      end
    else
      p shopify_product.errors.messages
    end
  end

  def update
    shopify_product = ShopifyAPI::Product.new(id: @bundle_group.shopify_product_id)
    shopify_product.title = @bundle_group.internal_name

    shopify_product.variants = []
    @bundle_group.bundles.each do |bundle|
      shopify_variant = ShopifyAPI::Variant.new(
        id: bundle.shopify_variant_id,
        price: (bundle.price_per_item * bundle.quantity_limit),
        option1: bundle.label
      )
      shopify_product.variants << shopify_variant
    end
    if shopify_product.save
      @bundle_group.bundles.each_with_index do |bundle, i|
        bundle.update(shopify_variant_id: shopify_product.variants[i].id)
      end
    else
      p shopify_product.errors.messages
    end
  end
end
