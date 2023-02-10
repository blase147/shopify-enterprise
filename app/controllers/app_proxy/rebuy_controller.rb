class AppProxy::RebuyController < AppProxyController
  before_action :init_session
  
  def init_session
    @skip_auth =  true
  end

  def index
    @rebuy = Rebuy.find_by_token(params[:token]) rescue nil
    @customer = @rebuy&.customer_modal
    all_product_ids = (@rebuy.purchased_products +  @rebuy.other_products)&.map{|m| m[:product].split("/").last}

    all_variant_ids = (@rebuy.purchased_products +  @rebuy.other_products)&.map{|m| m[:variant].split("/").last}

    all_products = ShopifyAPI::Product.where(variant_ids: variant_ids,  fields: 'id,title,images')
  
    @all_products = []
    @rebuy.purchased_products.each do |product|
      variant = product[:variant][/\d+\]
      current_product = all_products.find{|p| p.variants.any? {|v| v.id == variant} }
      new_hash = {
        "title": current_product.title,
        "images": current_product.images,
        "price": current_product.price,
        "variant_id": variant
      }
      @all_products << new_hash
    end

    @purchased_products = @all_products.select{|product| @rebuy.purchased_products.include?(product.id)}
    @other_products = @all_products.select{|product| @rebuy.other_products.include?(product.id)}

    render content_type: 'application/liquid', layout: "rebuy_liquid_app_proxy"
  end

  def rebuy_items
  end


  def upsells
  end 

end