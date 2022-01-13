class ShippingSuitesController < ApplicationController

  def sync_orders
    shop = Shop.where(shopify_domain: params[:shop_domain]).last
    if shop.present?
      shop.connect
      ShipEngineService::SyncOrders.new(shop).sync
    end
    head :no_content
  end
end
