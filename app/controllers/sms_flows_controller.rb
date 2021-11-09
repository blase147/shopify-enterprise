class SmsFlowsController < AuthenticatedController
  before_action :set_sms_flow, only: [:show, :destroy]
  skip_before_action :verify_authenticity_token

  def index
    @sms_flows = current_shop.sms_flows
    render json: @sms_flows
  end

  def show
  end

  def create
    if params[:id]
      @sms_flow = SmsFlow.find(params[:id])
      @sms_flow.assign_attributes(sms_flow_params) if @sms_flow.shop_id == current_shop.id
    else
      @sms_flow = SmsFlow.new(sms_flow_params)
      @sms_flow.shop = current_shop
    end

    if @sms_flow.save
      render :show, status: :created, location: @sms_flow
    else
      render json: @sms_flow.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @sms_flow.destroy
    respond_to do |format|
      format.html { redirect_to sms_flows_url, notice: 'Sms flow was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sms_flow
      @sms_flow = SmsFlow.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def sms_flow_params
      params.require(:sms_flow).permit(:name, :status, :description)
    end
end
