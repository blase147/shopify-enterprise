class DebugModeController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def index
    debug_setting = ShopSetting.find_by(shop_id: current_shop.id)
    ENV['DEBUG'] = debug_setting&.debug_mode
    render json: { debug_mode: debug_setting&.debug_mode }
  end

  def create
    debug_settings = ShopSetting.find_by(shop_id: current_shop.id)

    if debug_settings.present?
      debug_settings.update(debug_mode: params[:status])
    else
      debug_settings = ShopSetting.create(shop_id: current_shop.id , debug_mode: params[:status])
    end
    render json: { status: true, debug_mode: debug_settings.debug_mode }
  end
end
