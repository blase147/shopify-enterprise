class SelectPlanController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def index
    current_shop = Shop.find_by_shopify_domain(params[:shop])
    current_shop.connect
    render :index, layout: 'layouts/subscriptions'
  end

  def create
    current_shop = Shop.find_by_shopify_domain(params[:shop])
    current_shop.connect
    @recurring_application_charge = StoreChargeService.new(current_shop).create_recurring_charge(params[:plan])
    redirect_to root_path({shop: current_shop.shopify_domain})
  end
end
