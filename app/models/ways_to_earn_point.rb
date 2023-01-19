class WaysToEarnPoint < ApplicationRecord
  validates :title, presence: true, uniqueness: { scope: :shop_id }
  belongs_to :shop
  enum :title=>{ "Place an Order": "0", "Signup": "1", "Celebrate a birthday": "2"}
end
