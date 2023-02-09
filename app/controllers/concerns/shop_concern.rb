module ShopConcern
    extend ActiveSupport::Concern
    def current_shop
        shopify_domain = params[:shopify_domain] || params[:shop_domain]
        shop = Shop.where("shops.shopify_domain = '#{shopify_domain}.myshopify.com' OR shops.shopify_domain = '#{shopify_domain}'") rescue nil
        @current_shop&.connect
        @current_shop = shop || Shop.find_by(shopify_domain: current_shopify_session.domain)
    end
end