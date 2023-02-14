class CustomerOrder < ApplicationRecord
  belongs_to :customer_modal
  belongs_to :shop
  validates :order_id, uniqueness: true
end
