class RemovedSubscriptionLine < ApplicationRecord
  validates_presence_of :customer_id, :subscription_id, :variant_id, :quantity
  after_create :log_work

  def log_work
    begin
      customer = Customer.find_by_shopify_id subscription_id
      subscription = SubscriptionContractService.new(subscription_id).run
      product = subscription.lines.edges.select{|s| s if s.node.variant_id == variant_id}.first.node
      note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
      description = customer.name+",just removed product,"+product.title
      amount = (product.quantity * product.current_price.amount.to_f).round(2).to_s
      customer.shop.subscription_logs.cancel.create(customer_id: customer.id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id)
    rescue
      true
    end
  end
end
