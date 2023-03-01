class CreateRebuyForAllCustomersWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_id = nil,rebuy_menu_id = nil)

        if shop_id.present? && rebuy_menu_id.present?
            RebuyService.new(shop_id).create_rebuy(rebuy_menu_id)
        else
            shops = shop_id.present? ? Shop.where(id: shop_id) : Shop.all&.includes(:rebuy_menus)
            shops&.each do |shop|
                shop.rebuy_menus&.each do |rebuy_menu|
                    RebuyService.new(shop.id).create_rebuy(rebuy_menu.id)
                end

            end
        end
    end
end