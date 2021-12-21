class Stripe::OrderCreate
  def initialize(csc)
    @csc = csc
    @shop = @csc.shop

  end

  def create
    @shop.connect
    # csc = CustomerSubscriptionContract.find(@id)
    variant_id = @csc.import_data["variant_id"]
    quantity = @csc.import_data["quantity"]
    customer_id = @csc.import_data["shopify_customer_id"]


    order = ShopifyAPI::Order.new(
              "customer_id"=> customer_id,
              "line_items" => [
                {"variant_id"=>variant_id, "quantity"=>quantity}]
            )
    order.save
  end
end
