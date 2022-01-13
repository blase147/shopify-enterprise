class ProductsController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def subscription_products
    shop = Shop.find_by(shopify_domain: params[:shop_domain])
    data = shop.with_shopify_session do
      ProductService.new.list_subscribable(params[:cursor])
    end

    render json: data
  end
end
