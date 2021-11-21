class SubscriptionLog < ApplicationRecord
  belongs_to :shop
  belongs_to :customer_subscription_contract, class_name: 'CustomerSubscriptionContract', foreign_key: 'customer_id'
  enum billing_status: %i[undefined success failure retry_success churn]
  enum action_type: %i[unchanged skip swap restart upsell delay billing shipping cancel pause resume info one_time_order opt_in upgrade downgrade quantity]
  enum log_type: %i[subscription sms]
  scope :pending_executions, -> { where(executions: :true) }
end
