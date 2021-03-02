class SubscriptionContract < ApplicationRecord
  def generate_billing
    SubscriptionBillingAttempService.new(self).create
  end
end
