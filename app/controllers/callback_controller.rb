class CallbackController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def charge
    pending_recurring_charge = PendingRecurringCharge.find_by_charge_id(params[:charge_id])
    current_shop = pending_recurring_charge&.shop
    return unless current_shop.present?
    current_shop.connect
    @recurring_application_charge = ShopifyAPI::RecurringApplicationCharge.find(params[:charge_id])
    if @recurring_application_charge.status == 'active'
      current_shop.recurring_charge_status = 'active'
      current_shop.recurring_charge_id = params[:charge_id]
      price = @recurring_application_charge.price.to_f
      current_shop.plan = if price == 199
                            'platinum'
                          elsif price == 0
                            'freemium'
                          end
      current_shop.save
      pending_recurring_charge.destroy
    end

    redirect_to "/"
  end
end
