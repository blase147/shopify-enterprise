class SubscriptionLog < ApplicationRecord
  belongs_to :shop
  belongs_to :customer
  enum billing_status: %i[undefined success failure retry_success churn]
  enum action_type: %i[unchanged skip swap restart upsell]
  scope :pending_executions, -> { where(executions: :true) }
end
