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

    previously_purchased = []
    @customer.customer_orders.order(created_at: :asc)&.limit(20)&.each do |customer_order|
      order = JSON.parse(customer_order&.api_data) rescue nil
      if order.present? 
                  begin
                    previously_purchased << (order["line_items"].map{|item| {product: "gid://shopify/Product/#{item["product_id"]}", variant: "gid://shopify/ProductVariant/#{item["variant_id"]}"}}.first)
                  rescue
                    previously_purchased << (order["line_items"]["edges"].map{|item| {product: "#{item["node"]["product"]["id"]}", variant: "#{item["node"]["variant"]["id"]}"} }.first  )
                  end
      end
    end

    previously_purchased_product_ids = previously_purchased&.map{|p| p[:product][/\d+/] }
    selected_product_ids  = (@rebuy.purchased_products +  @rebuy.other_products)&.uniq&.map{|m| JSON.parse(m)["product"][/\d+/]} 
    previously_purchased_product_ids = previously_purchased_product_ids - @rebuy.purchased_products&.map{|m| JSON.parse(m)["product"][/\d+/]} 
    all_product_ids = selected_product_ids + previously_purchased_product_ids 
    all_products = ShopifyAPI::Product.where(ids: all_product_ids&.uniq&.join(","),  fields: 'id,title,images,variants, product_type')

    @all_products = []
    previously_purchased = previously_purchased.map{|p| p.to_json}
    all_db_products = @rebuy.purchased_products + @rebuy.other_products + previously_purchased
    all_db_products&.each do |product|
      product = JSON.parse(product)
      variant = product["variant"][/\d+/]&.to_i
      current_product = all_products.find{|p| p&.variants&.any? {|v| v&.id == variant&.to_i} }
      current_variant = current_product&.variants&.find{|v| v&.id == variant}
      if current_product.present?
        new_hash = {
          "id": current_product.id,
          "title": current_product.title,
          "image": current_product&.images&.first&.src,
          "price": current_variant.price,
          "variant_id": variant,
          "variant_name": current_variant.title,
          "inventory_quantity": current_variant.inventory_quantity
        }
      end
      @all_products << new_hash
    end

    @purchased_products = @all_products.select{ |product| @rebuy.purchased_products.map{|p| JSON.parse(p)["product"][/\d+/]}.include?("#{product[:id]}") }&.uniq
    @other_products = @all_products.select{|product| @rebuy.other_products.map{|p| JSON.parse(p)["product"][/\d+/]}.include?("#{product[:id]}")}&.uniq
    @previously_purchased = @all_products.select{|product| previously_purchased_product_ids.include?("#{product[:id]}")}&.uniq

    render content_type: 'application/liquid', layout: "rebuy_liquid_app_proxy"
  end

  def rebuy_items
  end


  def upsells
  end 

end

#trigger rebuild
