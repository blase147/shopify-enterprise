class AdditionalContact < ApplicationRecord
  belongs_to :customer, class_name: 'CustomerSubscriptionContract', foreign_key: 'customer_id'
  default_scope { order(created_at: :asc) }
end
