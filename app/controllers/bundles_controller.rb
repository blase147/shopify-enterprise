class BundlesController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def destroy
    bundle = Bundle.find(params[:id])
    if bundle.bundle_group.shop_id == current_shop.id && bundle.destroy
      render json: {success: true}
    else
      render json: {success: false}
    end
  end
end
