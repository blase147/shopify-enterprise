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

  private
  def stripe_key_params
    params.permit(:stripe_api_key, :stripe_publish_key)
  end
end
