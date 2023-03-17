class RebuyService
    def initialize(shop_id)
        @shop_id = shop_id        
    end

    def get_most_popular_products
        shop = Shop.find(@shop_id)
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
                    product = products_order_count&.select{|v| v[:variant][/\d+/] ==  line_item&.node&.variant&.id[/\d+/]}.first
                    if product.present?
                        quantity = product[:quantity] + line_item&.node&.quantity
                        new_hash = {product: line_item&.node&.product&.id, variant: line_item&.node&.variant&.id, quantity: product[:quantity]}
                        new_arr = []
                        products_order_count.each do |v|
                            if v[:variant][/\d+/] == line_item&.node&.variant&.id[/\d+/]
                                new_arr << {product: line_item&.node&.product&.id, variant: line_item&.node&.variant&.id, quantity: quantity}
                            else
                                new_arr << v
                            end

                        end                            
                        products_order_count = new_arr
                    else
                        products_order_count << {product: line_item&.node&.product&.id, variant: line_item&.node&.variant&.id, quantity: line_item&.node&.quantity, order: order[:id]}
                    end
                end
            end
        end
        products_order_count
    end
    
    def create_rebuy(rebuy_menu_id)
        shop = Shop.find(@shop_id)   
        shop.connect
        rebuy_menu = RebuyMenu.find(rebuy_menu_id)
        shop.customer_modals&.each do |customer|
            customer_rebuys = customer.rebuys
            unless customer_rebuys.where(status: "open").count > 0
                if rebuy_menu.rebuy_type&.downcase == "auto( 5 most popular variant ids)"
                    most_popular_products = get_most_popular_products
                    qualified_products = filter_product_from_order_history(rebuy_menu.id, most_popular_products, customer.id)
                    qualified_products = qualified_products.map { |hash| hash.except(:created_at) }
                    purchased_products = [qualified_products.first]
                    other_products = most_popular_products - purchased_products
                elsif rebuy_menu.rebuy_type&.downcase == "collection"
                    collection_products = rebuy_menu.collection_images.map{|p| p["products"]}.first
                    collection_products_ids = collection_products.map{|item| item["product_id"][/\d+/]}
                    all_products = ShopifyAPI::Product.where(ids: collection_products_ids.join(","),  fields: 'id,variants')
                    collection_products_with_vairants = []
                    all_products.each do |p|
                        p.variants.each do |v|
                            collection_products_with_vairants << {product: "gid://shopify/Product/#{p.id}",variant: "gid://shopify/ProductVariant/#{v.id}"}
                        end
                    end
                    
                    qualified_products = get_collection_products(rebuy_menu_id, customer.id,collection_products_with_vairants )
                    qualified_products = qualified_products.map { |hash| hash.except(:created_at) }
                    purchased_products = [qualified_products&.first]
                    other_products = collection_products_with_vairants - purchased_products rescue []
                end
                if qualified_products.present?
                    token = SecureRandom.urlsafe_base64(nil, false)
                    shop.rebuys.create(
                        token: token,
                        purchased_products: purchased_products&.map{|v| v.to_json},
                        other_products: other_products&.map{|v| v.to_json},
                        customer_modal_id: customer.id,
                        rebuy_menu_id: rebuy_menu.id
                    )
                    # sent = send_email_and_sms(customer.id, token) rescue nil
                end
            end
        end
    end

    def populate_data
        shop = Shop.find(@shop_id)
        all_orders = JSON.parse( shop.bulk_operation_responses.find_by_response_type("all_orders")&.api_raw_data, object_class: OpenStruct)
        
        products_order_count = get_products_with_quantity(all_orders)
        most_popular_products  = products_order_count&.sort_by {|k,v| v}&.reverse    
        most_popular_products = most_popular_products.first(5)&.map(&:first)
    end

    def filter_product_from_order_history(rebuy_menu_id, products, customer_modal_id)
        shop = Shop.find(@shop_id)
        rebuy_menu = RebuyMenu.find(rebuy_menu_id)
        interval_count = rebuy_menu.interval_count
        interval_type = rebuy_menu.interval_type

        customer = CustomerModal.find(customer_modal_id)
        customer_orders = customer.customer_orders
       
        qualified_products = []
        customer.customer_orders&.each do |customer_order|
            order = JSON.parse(customer_order&.api_data) rescue nil
            if order.present?
                qualifying_date = order["created_at"].to_date.advance("#{interval_type.downcase}s": interval_count.to_i)
                qualifed = qualifying_date >= Date.today ? true : false
                if qualifed
                    begin
                        qualified_products << order["line_items"].map{|item| {product: "gid://shopify/Product/#{item["product_id"]}", variant: "gid://shopify/ProductVariant/#{item["variant_id"]}", created_at: order["created_at"].to_time} if products.any?{|p| p[:variant] = "gid://shopify/ProductVariant/#{item["variant_id"]}"}}.first
                    rescue
                        qualified_products << order["line_items"]["edges"].map{|item| {product: "#{item["node"]["product"]["id"]}", variant: "#{item["node"]["variant"]["id"]}", created_at: order["created_at"].to_time} if products.any?{|p| p[:variant] = "#{item["node"]["variant"]["id"]}"}}.first  
                    end
                end
            end
        end
        qualified_products  = qualified_products&.compact&.sort_by {|p| p[:created_at]}&.reverse 
        return qualified_products
    end

    def send_email_and_sms(customer_id, token)
        url = "https://#{shop&.shopify_domain}/a/chargezen/rebuy/#{token}"
        customer = CustomerModal.find(customer_id)
        shop = Shop.find(@shop_id)
        message_service = SmsService::MessageGenerateService.new(shop, customer)
        phone = customer.phone
        if phone.present?
            message = message_service.content("Rebuy",nil,url)
            sent = TwilioServices::SendSms.call(from: shop.phone, to: phone, message: message) rescue nil
        end
        sent = SendEmailService.new.send_rebuy_email(customer, auth_token, current_shop.id)
    end

    def update_customer_order(order_id)
        begin
            shop = Shop.find(@shop_id)
            shop.connect
            order = ShopifyAPI::Order.find(order_id) rescue nil
            customer = CustomerModal.find_by("lower(email) = '#{order.email.downcase}' ") rescue nil
            customer_order = CustomerOrder.find_or_initialize_by(order_id: order_id)
            status = order.cancelled_at.present? ? "canceled" : order.financial_status.downcase
            customer_order.update(shop_id: shop.id, customer_modal_id: customer.id, api_data: order.to_json, status: status)
        rescue => e
            puts e
        end
    end

    def get_collection_products(rebuy_menu_id, customer_id, collection_products)
        shop = Shop.find @shop_id
        rebuy_menu = RebuyMenu.find(rebuy_menu_id)
        interval_count = rebuy_menu.interval_count
        interval_type = rebuy_menu.interval_type

        customer = CustomerModal.find(customer_id)
        qualified_products = []
        customer.customer_orders.each do |customer_order|
            order = JSON.parse(customer_order.api_data)
            qualifying_date = order["created_at"].to_date.advance("#{interval_type.downcase}s": interval_count.to_i)
            qualifed = qualifying_date >= Date.today ? true : false
            p "order_id=======#{customer_order.id}"
            if qualifed
                begin
                    qualified_products << order["line_items"].map{|item| {product: "gid://shopify/Product/#{item["product_id"]}", variant: "gid://shopify/ProductVariant/#{item["variant_id"]}",created_at: order["created_at"].to_time} if collection_products.any?{|p| p[:variant] = "gid://shopify/ProductVariant/#{item["variant_id"]}"}}.first
                rescue
                    qualified_products << order["line_items"]["edges"].map{|item| {product: "#{item["node"]["product"]["id"]}", variant: "#{item["node"]["variant"]["id"]}", created_at: order["created_at"].to_time} if collection_products.any?{|p| p[:variant] = "#{item["node"]["variant"]["id"]}"}}.first
            
                end
            end
        end
        qualified_products  = qualified_products&.compact&.sort_by {|p| p[:created_at]}&.reverse 
        return qualified_products
    end
end
