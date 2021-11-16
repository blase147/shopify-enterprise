class SmsFlowsController < AuthenticatedController
  before_action :set_sms_flow, only: [:show, :destroy, :edit, :update]
  skip_before_action :verify_authenticity_token

  def index
    @sms_flows = current_shop.sms_flows
    render json: @sms_flows
  end

  def new
    @sms_flow = SmsFlow.new
  end

  def create
    @sms_flow = SmsFlow.new(name: params[:flowName], content: params[:basicElements])
    @sms_flow.shop = current_shop
    if @sms_flow.save
      render :show, status: :created, location: @sms_flow
      # redirect_to sms_flow_path
    else
      render json: @sms_flow.errors, status: :unprocessable_entity
    end
  end

  def edit
    render json: @sms_flow
  end

  def update
    if @sms_flow.update(sms_flow_params)
      render :show, status: :created, location: @sms_flow
    else
      render json: @sms_flow.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @sms_flow.destroy
      respond_to do |format|
        format.html { redirect_to sms_flows_url, notice: 'Sms flow was successfully destroyed.' }
        format.json { head :no_content }
      end
    end
  end

  def show

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sms_flow
      @sms_flow = SmsFlow.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def sms_flow_params
      params.require(:sms_flow).permit(:name, :status, :description, :content)
    end
end
