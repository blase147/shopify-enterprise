class BillingAddress < ApplicationRecord
  belongs_to :customer_subscription_contract, class_name: 'CustomerSubscriptionContract', foreign_key: 'customer_id'
end
