class SelectPlanController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def index
    render :index, layout: 'layouts/subscriptions'
  end

  def create
    @recurring_application_charge = StoreChargeService.new(current_shop).create_recurring_charge(params[:plan])
  end
end
