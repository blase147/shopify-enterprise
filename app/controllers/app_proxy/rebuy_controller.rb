class AppProxy::RebuyController < AppProxyController
  before_action :init_session
  
  def init_session
    @skip_auth =  true
  end

  def index
    @rebuy = Rebuy.find_by_token(params[:token]) rescue nil
    @customer = @rebuy&.customer_modal
    shop = @rebuy.shop
    shop.connect
    all_product_ids = (@rebuy.purchased_products +  @rebuy.other_products)&.map{|m| JSON.parse(m)["product"][/\d+/]}

    all_products = ShopifyAPI::Product.where(id: all_product_ids,  fields: 'id,title,images,variants')
  
    @all_products = []
    all_db_products = @rebuy.purchased_products + @rebuy.other_products
    all_db_products&.each do |product|
      product = JSON.parse(product)
      variant = product["variant"][/\d+/]&.to_i
      current_product = all_products.find{|p| p.variants.any? {|v| v.id == variant.to_i} }
      current_variant = current_product.variants.find{|v| v.id == variant}
      new_hash = {
        "id": current_product.id,
        "title": current_product.title,
        "image": current_product&.images&.first&.src,
        "price": current_variant.price,
        "variant_id": variant
      }
      @all_products << new_hash
    end

    @purchased_products = @all_products.select{|product| @rebuy.purchased_products.map{|p| JSON.parse(p)["product"][/\d+/]}.include?("#{product[:id]}")}
    @other_products = @all_products.select{|product| @rebuy.other_products.map{|p| JSON.parse(p)["product"][/\d+/]}.include?("#{product[:id]}")}

    render content_type: 'application/liquid', layout: "rebuy_liquid_app_proxy"
  end

  def rebuy_items
  end


  def upsells
  end 

end