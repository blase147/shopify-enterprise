class StripeContract < ApplicationRecord
  belongs_to :shop
  belongs_to :customer_modal

  has_one_attached :contract_pdf, dependent: :destroy
end
