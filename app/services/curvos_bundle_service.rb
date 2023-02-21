class CurvosBundleService
    def update_shopify_id(shop_id, order_id)
        shop = Shop.find(shop_id)
        shop.connect
        order = ShopifyAPI::Order.find(order_id)
        notes = order.note&.split(",")
        mix_panel_id=nil;
        variants = {}
        notes.each do |note|
            mix_panel_id = note.split(":").last&.strip if note.include?("mixpanel_id:")
            if note.include?("variant")
                variants["#{note.split(":").first&.strip}"] = note.split(":").last&.strip
            end
        end
        curvos_model = CurvosModel.find_by_mix_panel_id(mix_panel_id)
        curvos_model.update(order_id: order_id)
        if curvos_model.status.nil?
            curvos_model&.update(customer_shopify_id: order.customer.id, variants: variants.to_json, status: "First Shipment Order Completed")
        else
        end
    end

end