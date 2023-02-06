class StripeContractsController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def fetch_stripe_customers
    Stripe.api_key = current_shop&.stripe_api_key
    stripe_customers = Stripe::Customer.search({query: "email~ '#{params[:query]}' OR name~ '#{params[:query]}'"})&.data&.pluck("email") rescue []
    render json:{status: :ok, customers: stripe_customers}
  end

  def create_stripe_contract
    shop = current_user.user_shops.joins(:shop).where("shops.shopify_domain = '#{params[:shopify_domain]}'")&.first rescue nil
    
  end

  def current_shop
    if params[:shopify_domain].present? && current_user.present?
      shop = current_user.user_shops.joins(:shop).where("shops.shopify_domain = '#{params[:shopify_domain]}.myshopify.com' OR shops.shopify_domain = '#{params[:shopify_domain]}'")&.first&.shop
      @current_shop = shop
    else
      @current_shop ||= Shop.find_by(shopify_domain: current_shopify_session.domain)
    end
  end

end
