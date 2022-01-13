class Stripe::SubscriptionPause
  def initialize(id, shop)
    @id = id
    @shop = shop
  end

  def pause
    Stripe::Subscription.update(
      @id, {
        pause_collection: {
          behavior: 'keep_as_draft',
        }
      }, {
        api_key: @shop.stripe_api_key
      }
    )
  end

  def resume
    Stripe::Subscription.update(
      @id, {
        pause_collection: ''
      }, {
        api_key: @shop.stripe_api_key
      }
    )
  end
end
