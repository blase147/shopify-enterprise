class AppProxy::StripeContractsController < AppProxyController
  before_action :init_session
  include StripeContractConcern
  def index
    check_if_stripe
    @stripe_contract = StripeContract.find_by_token(params[:token])
    @customer = @stripe_contract&.customer_modal rescue nil
    if params[:redirect_url].present?
      redirect_to params[:redirect_url]
    else
      render content_type: 'application/liquid', layout: "rebuy_liquid_app_proxy"
    end
  end

  private
  def init_session
    @skip_auth =  true
  end

  def init_stripe
    Stripe.api_key = current_shop&.stripe_api_key
  end

  def check_if_stripe
    if params[:stripe_response]&.present?
      if params[:stripe_response] =="success"
        StripeContract.find(params[:contract_id])&.update(checked_out: true)
      end
    end
  end

end
