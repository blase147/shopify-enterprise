class CallbackController < AuthenticatedController
  skip_before_action :verify_authenticity_token

  def charge
    return unless current_shop.present?

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
    end

    redirect_to "https://#{current_shop.shopify_domain}/admin/apps/"
  end
end
