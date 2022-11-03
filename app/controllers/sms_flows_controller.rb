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
    if params[:flowId].present?

      @sms_flow = SmsFlow.find(params[:flowId])
    else
      @sms_flow = SmsFlow.new
    end
    @sms_flow.assign_attributes(name: params[:flowName], content: params[:basicElements], status: params[:flowStatus])
    @sms_flow.shop = current_shop

    @sms_flow.trigger = @sms_flow.content[0]['nodeData']['id']
    if @sms_flow.save
      render json: @sms_flow
    else
      render json: @sms_flow.errors, status: :unprocessable_entity
    end
  end

  def edit
    render json: @sms_flow
  end

  def update
    if @sms_flow.update(status: params[:status])
      render json: @sms_flow
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

  def update_smart_message_status
    SmartyMessage.find(params[:id])&.update(status: params[:status])
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
