class CallbackController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def charge
    @shop = Shop.find_by_recurring_charge_id(params[:charge_id])
    return unless @shop.present?

    @shop.connect
    @recurring_application_charge = ShopifyAPI::RecurringApplicationCharge.find(params[:charge_id])
    if @recurring_application_charge.status == 'active'
      @recurring_application_charge.activate
      @shop.update(recurring_charge_status: 'active')
    end

    redirect_to "https://#{@shop.shopify_domain}"
  end
end
