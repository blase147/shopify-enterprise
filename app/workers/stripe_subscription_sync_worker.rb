class StripeSubscriptionSyncWorker
  include Sidekiq::Worker

  def perform(shop_id, automatic=false)
    shop = Shop.find(shop_id)
    shop.connect

    stripe_subscriptions = Stripe::Subscription.list({}, {api_key: shop.stripe_api_key})
    loop do
      stripe_subscriptions.data.each do |stripe_subscription|
        Stripe::SubscriptionSync.run(shop, stripe_subscription)
      end
      if stripe_subscriptions.has_more
        stripe_subscriptions = Stripe::Subscription.list(
          {starting_after: stripe_subscriptions.data.last.id},
          {api_key: shop.stripe_api_key}
        )
      else
        break
      end
    end
    StripeSubscriptionSyncWorker.perform_in(1.day, true) if automatic
  end
end
