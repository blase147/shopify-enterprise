class DebugModeController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def create
    debug_settings = ShopSetting.find_by(shop_id: current_shop.id)

    if debug_settings.present?
      status = debug_settings.update(debug_mode: params[:status])
    else
      status = ShopSetting.create(shop_id: current_shop.id , debug_mode: params[:status])
    end

    render json: { status: status.valid?, errors: status.valid? ? [] : status.errors.full_messages  }
  end
end
