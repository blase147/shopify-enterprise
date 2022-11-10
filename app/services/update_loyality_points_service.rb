class UpdateLoyalityPointsService
    def self.update_order_loyality_points(shop, order_id)
        place_order_way = WaysToEarnPoint.find_by_title("Place an Order")
        if(place_order_way&.present? && place_order_way&.status)
            shop.connect
            order = ShopifyAPI::Order.find(order_id) rescue nil
            if order.present?
                customer = CustomerModal.find_by_shopify_id(order&.customer&.id)
                spent_amount = order.subtotal_price
                if order&.financial_status == "canceled" || order&.financial_status == "refunded"
                    total_points = customer&.loyalty_points - (spent_amount * 5)
                elsif order&.financial_status == "paid"
                    total_points = (spent_amount&.to_f * place_order_way&.points_awarded&.to_f)
                    total_points = total_points&.to_f + customer&.loyalty_points&.to_f if customer&.loyalty_points.present?
                end
                customer.update(loyalty_points: total_points)
            end
        end
    end
end