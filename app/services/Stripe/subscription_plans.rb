class Stripe::SubscriptionPlans
  def initialize(amount, interval, currency, id = nil)
    super()
    @amount = amount
    # @name = name
    @interval = interval
    @currency = currency
    @id = id
  end

  def plan_create
    Stripe::Plan.create(
      :amount => @amount,         #<== Amount is in cents, not dollars
      :interval => @interval,
      :currency => @currency,
      :id => @id
    )
  end

  def plan_retrieve
    Stripe::Plan.retrieve(
      @id
      )
  end

  def plan_list
    Stripe::Plan.list({limit: 3})
  end

  def plan_delete
    Stripe::Plan.delete(
      @id
    )
  end
end
