class RemovedSubscriptionLine < ApplicationRecord
  validates_presence_of :customer_id, :subscription_id, :variant_id, :quantity
end
