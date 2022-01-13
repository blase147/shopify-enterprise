class Stripe::SubscriptionCreate
  def initialize(customer, unit_amount, interval, interval_count, product, anchor)
    super()
    @customer = customer
    @anchor = anchor
    @unit_amount = unit_amount
    @interval = interval
    @interval_count = interval_count
    @product = product
  end

  def subscription
    Stripe::Subscription.create(
      {
        customer: @customer,
        billing_cycle_anchor: @anchor,
        items: [
          {
            price_data: {
              unit_amount_decimal: @unit_amount,
              currency: 'usd',
              recurring: {interval: @interval, interval_count: @interval_count},
              product: @product
            }
          }
        ]
      })
  end
end
