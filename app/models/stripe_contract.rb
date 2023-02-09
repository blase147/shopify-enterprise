class StripeContract < ApplicationRecord
  belongs_to :shop
  belongs_to :customer_modal
  belongs_to :stripe_contract_pdf, optional: true
  enum :payment_by => {"admin": "admin", "customer": "customer"}
end
