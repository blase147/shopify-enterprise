class AppProxy::BundlesController < ApplicationController

  def plan_type
    @bundle_group = BundleGroup.find_by(shop_id: current_shop.id, shopify_product_id: params[:product_id])
    if @bundle_group.present?
      render json: { success: true, bundle_group: @bundle_group }
    else
      render json: { success: false }
    end
  end
end
