class DebugModeController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def create
    @shop = DebugMode.find(current_shop.id)
    binding.pry
    if @shop
      @status = @shop.update(status: params[:status])
    else
      @status = DebugMode.create(shop_id: current_shop.id , status: params[:status])
    end

    render json: { status: true ) }
  end
end
