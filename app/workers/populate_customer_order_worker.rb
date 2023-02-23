class PopulateCustomerOrderWorker
    include Sidekiq::Worker
    def perform
        shops = Shop.all
        shops&.each do |shop|
            shop = Shop.find(shop.id)
            all_orders = JSON.parse( shop.bulk_operation_responses.find_by_response_type("all_orders")&.api_raw_data)&.map{ |object| object.deep_transform_keys(&:underscore)} rescue nil
            if all_orders.present?
                customers_with_orders = get_all_customers_of_most_popular_products(all_orders)
                customers_with_orders&.each do |customer_with_order|
                    customer = CustomerModal.find_by("lower(email) = '#{customer_with_order.first.downcase}' ") rescue nil
                    if customer.present?
                        orders = customer_with_order.second
                        orders.each do |order|
                            order_object = JSON.parse(order)
                            order_id = order_object["id"]

                            status = order_object["cancelled_at"].present? ? "canceled" : order_object["display_financial_status"].downcase
                            customer_order = CustomerOrder.find_or_initialize_by(order_id: order_id)
                            customer_order.update(shop_id: shop.id, customer_modal_id: customer.id, api_data: order, status: status)
                        end
                    end
                end
            end        
        end
    end

    def get_all_customers_of_most_popular_products all_orders
        customers_with_orders = {}
        all_orders.each do |order| 
            order["line_items"]["edges"].each do |line_item|
                if customers_with_orders["#{order["email"]}"].present?
                customers_with_orders["#{order["email"]}"] << order.to_json
                else
                customers_with_orders["#{order["email"]}"] = [order.to_json]
                end 
            end 
        end
        customers_with_orders
    end
end
