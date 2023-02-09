class ProductsController < ActionController::Base
  include ShopConcern
  skip_before_action :verify_authenticity_token

  def subscription_products
    shop = current_shop
    data = shop.with_shopify_session do
      ProductService.new.list_subscribable(params[:cursor])
    end

    render json: data
  end
end
