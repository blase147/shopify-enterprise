class RebuyService
    def init
    end

    def get_most_popular_products(shop_id)
        shop = Shop.find(shop_id)
        all_orders = JSON.parse( shop.bulk_operation_responses.find_by_response_type("all_orders")&.api_raw_data, object_class: OpenStruct)        
        products_order_count = get_products_with_quantity(all_orders)
        most_popular_products  = products_order_count&.compact&.sort_by {|p| p[:quantity]}&.reverse    
        return most_popular_products.first(5)&.map{|p| {product: p[:product], variant: p[:variant]}}
    end
    
    def get_products_with_quantity all_orders
        products_order_count = []
        all_orders&.each do |order|
            order&.lineItems&.edges.each do |line_item|
            variant = line_item&.node&.variant&.id
            if variant.present?
                product = products_order_count.select{|v| v[:variant] == variant}&.first rescue nil
                if product.present?
                    product[:quantity] += line_item&.node&.quantity
                    new_hash = {product: line_item&.node&.product&.id, variant: line_item&.node&.variant&.id, quantity: product[:quantity]}
                    products_order_count = products_order_count.map{|v| v = new_hash if v[:variant] == variant}
                else
                    products_order_count << {product: line_item&.node&.product&.id, variant: line_item&.node&.variant&.id, quantity: line_item&.node&.quantity}
                end
            end
            end
        end
        products_order_count
    end
    
    # def get_all_customers_of_most_popular_products all_orders, most_popular_products
    #     customers_with_products = {}
    #     all_orders.each do |order| 
    #       order.lineItems.edges.each do |line_item|
    #         if most_popular_products.include?(line_item&.node&.variant&.id)
    #           if customers_with_products["#{order.email}"].present?
    #             customers_with_products["#{order.email}"] << {product: line_item&.node&.variant&.id, variant: line_item.node.variant.id}
    #           else
    #             customers_with_products["#{order.email}"] = [{product: line_item&.node&.variant&.id, variant: line_item.node.variant.id}]
    #           end
    #         end 
    #       end 
    #     end
    #     customers_with_products
    # end
    
    def create_rebuy(shop_id, customer_modal_id)
        shop = Shop.find(shop_id)   
        most_popular_products = get_most_popular_products(shop_id)   
        purchased_products = filter_product_from_order_history(most_popular_products, shop_id, customer_modal_id)

        other_products = most_popular_products - purchased_products
        customer = CustomerModal.find(customer_modal_id)
        token = SecureRandom.urlsafe_base64(nil, false)
        shop.rebuys.create(
            token: token,
            purchased_products: purchased_products&.map{|v| v.to_json},
            other_products: other_products&.map{|v| v.to_json},
            customer_modal_id: customer.id
        )
    end

    def populate_data(shop_id)
        shop = Shop.find(shop_id).includes(:bulk_operation_responses)
        all_orders = JSON.parse( shop.bulk_operation_responses.find_by_response_type("all_orders")&.api_raw_data, object_class: OpenStruct)
        
        products_order_count = get_products_with_quantity(all_orders)
        most_popular_products  = products_order_count&.sort_by {|k,v| v}&.reverse    
        most_popular_products = most_popular_products.first(5)&.map(&:first)
    end

    def filter_product_from_order_history(products, shop_id, customer_modal_id)
        shop = Shop.find(shop_id)
        all_orders = JSON.parse( shop.bulk_operation_responses.find_by_response_type("all_orders")&.api_raw_data, object_class: OpenStruct)
        customer = CustomerModal.find(customer_modal_id)
        customer_orders = customer.customer_orders
        purchased_products = []
        other_products = []
        customer.customer_orders&.each do |customer_order|
            order = JSON.parse(customer_order&.api_data) rescue nil
            order["line_items"]["edges"]&.each do |v| 
                product = v["node"]["product"]["id"] rescue nil
                variant = v["node"]["variant"]["id"] rescue nil
                if  products.include?({product: product, variant: variant}) 
                    purchased_products << {product: product, variant:variant} 
                # else  
                #     other_products << {product: v["node"]["product"]["id"], variant: v["node"]["variant"]["id"]}
                end 
            end
        end
        return purchased_products
    end

end