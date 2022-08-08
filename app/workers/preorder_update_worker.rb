class PreorderUpdateWorker
    include Sidekiq::Worker
    def perform
        contracts = CustomerSubscriptionContract.all
        contracts&.each do |contract|
            contract.shop.connect
            contract.api_data["orders"]["edges"]&.each do |order|
                shopify_order =  ShopifyAPI::Order.find(order["node"]["id"].split("/")&.last&.to_i)
                products = []
                shopify_order&.line_items.map{|p| products << p&.product_id&.to_s }
                note_hash = JSON.parse(shopify_order&.note) rescue {}
                note_hash = note_hash.transform_keys(&:downcase)
                expected_delivery_date = note_hash["expected delivery date"]
                week = expected_delivery_date.nil? ? "0" : expected_delivery_date&.to_date&.strftime("%W")&.to_s
                WorldfarePreOrder.upsert({shop_id: contract.shop_id,customer_id: contract.shopify_customer_id, week:  week,products: products&.to_s, shopify_contract_id: contract.shopify_id, expected_delivery_date: expected_delivery_date, order_id: shopify_order&.id.to_s}, unique_by: :order_id )
            end
        end
    end
end