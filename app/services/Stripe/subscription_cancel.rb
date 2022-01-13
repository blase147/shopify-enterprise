class Stripe::SubscriptionCancel
  def initialize(id, shop)
    @id = id
    @shop = shop
  end

  def delete
    Stripe::Subscription.delete(
      @id, nil, {
        api_key: @shop.stripe_api_key
      }
    )
  end
end
