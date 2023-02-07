class AddStripeContractPdfReferenceToStripeContract < ActiveRecord::Migration[6.0]
  def change
    add_reference :stripe_contracts, :stripe_contract_pdf, null: true, foreign_key: true
  end
end
