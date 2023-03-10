class SubscriptionProduct < ApplicationRecord
    belongs_to :selling_plan, optional: true
    belongs_to :shop
end