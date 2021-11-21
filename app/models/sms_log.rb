class SmsLog < ApplicationRecord
  belongs_to :customer_subscription_contracts, class_name: 'CustomerSubscriptionContract', foreign_key: 'customer_id'
  belongs_to :shop

  enum action: %i[swap skip delay billing shipping cancel pause restart resume info one_time_order opt_in]
end
