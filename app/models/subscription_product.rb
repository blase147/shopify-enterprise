class SubscriptionProduct < ApplicationRecord
    belongs_to :selling_plan
    belongs_to :shop
end