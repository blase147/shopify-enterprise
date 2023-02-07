class StripeContractPdf < ApplicationRecord
  belongs_to :shop
  has_many :stripe_contracts
  has_one_attached :contract_pdf, dependent: :destroy
end
