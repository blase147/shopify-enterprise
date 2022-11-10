class WaysToEarnPoint < ApplicationRecord
  validates :title, uniqueness: true
  belongs_to :shop
  enum :title=>{ "Place an Order": "0", "Signup": "1", "Celebrate a birthday": "2"}
end
