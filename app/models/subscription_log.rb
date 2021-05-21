class SubscriptionLog < ApplicationRecord
  enum billing_status: %i[undefined success failure retry retry_success churn]
  enum action_type: %i[unchanged skip swap restart]
end
