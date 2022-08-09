class PreorderUpdateWorker
    include Sidekiq::Worker
    def perform
        contracts = CustomerSubscriptionContract.all
        contracts&.each do |contract|
            contract.shop.connect
            if contract.api_data["orders"].present?
                contract.api_data["orders"]["edges"]&.each do |order|
                    shopify_order =  ShopifyAPI::Order.find(order["node"]["id"].split("/")&.last&.to_i) rescue nil
                    if shopify_order.present?
                        products = []
                        shopify_order&.line_items.map{|p| products << p&.product_id&.to_s }
                        note_hash = shopify_order&.note_attributes
                        expected_delivery_date=nil
                        note_hash&.each do |note|
                            if note&.name.downcase == "delivery date" || note&.name.downcase == "expected delivery date"
                                expected_delivery_date = note.value
                            end 
                        end
                        week = expected_delivery_date.nil? ? "0" : expected_delivery_date&.to_date&.strftime("%W")&.to_s
                        WorldfarePreOrder.upsert({shop_id: contract.shop_id,customer_id: contract.shopify_customer_id, week:  week,products: products&.to_s, shopify_contract_id: contract.shopify_id, expected_delivery_date: expected_delivery_date, order_id: shopify_order&.id.to_s}, unique_by: :order_id )
                    end
                end
            end
        end
    end
end