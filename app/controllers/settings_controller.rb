class SettingsController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def stripe_settings
    render json: { status: :ok, publish_key: current_shop.stripe_publish_key, secret_key: current_shop.stripe_api_key }
  end

  def update_stripe_settings
    shop = Shop.find_by(id: current_shop.id)
    shop.update( stripe_api_key: stripe_key_params[:stripe_api_key], stripe_publish_key: stripe_key_params[:stripe_publish_key] )
    render json: { status: :ok }
  end

  def delivery_options
    options = DeliveryOption.find_by(shop_id: current_shop.id)

    if options.nil?
      options = DeliveryOption.create( shop_id: current_shop.id, delivery_option: params[:delivery_option], settings: params[:settings].to_json )
    else
      options.delivery_option = params[:delivery_option]
      options.settings = params[:settings].to_json
      options.save
    end
    render json: { status: :ok, options: options}
  end

  def get_delivery_option
    render json: { status: :ok, options: DeliveryOption.find_by(shop_id: current_shop.id)&.api_response}
  end

  def update_timezone
    if params[:timezone].present?
      current_shop.setting.update(timezone: params[:timezone])
      render json:{status: :ok}
    end
  end

  def change_language
    if params[:language].present?
      current_shop.update(language: params[:language])
      render json:{status: :ok}
    end
  end
  
  def current_language
    render json:{ language: current_shop.language }
  end

  private
  def stripe_key_params
    params.permit(:stripe_api_key, :stripe_publish_key)
  end

  def delivery_option_params
    params.permit( :delivery_option, :settings, :shop_id )
  end
end
