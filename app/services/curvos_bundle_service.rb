class CurvosBundleService
    def update_shopify_id(shop_id,order_id)
        shop = Shop.find(shop_id)
        shop.connnect
        order = ShopifyAPI::Order.find(order_id)
        notes = order.note&.split(",")
        mix_panel_id=nil;
        notes.map{|note| mixpanel_id = note.split(":").last if note.include?("mixpanel_id:")}
        if mix_panel_id.present?
            curvos_model = CurvosModel.find_by_mix_panel_id(mix_panel_id)
            curvos_model.update(customer_shopify_id: order.customer.id)
        end
    end
end