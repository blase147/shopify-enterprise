class PowerPlansController < AuthenticatedController
  before_action :set_shop
  skip_before_action :verify_authenticity_token

  def pause
    PowerPlanPauseWorker.perform_async @shop.id, params[:id], 'PAUSED'
    render json: { success: true }
  end

  def cancel
    PowerPlanPauseWorker.perform_async @shop.id, params[:id], 'CANCELLED'
    render json: { success: true }
  end

  def set_shop
    @shop = Shop.find_by(shopify_domain: current_shopify_domain)
  end
end
