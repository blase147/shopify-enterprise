class AddTokenAndPaymentByToStripeContract < ActiveRecord::Migration[6.0]
  def change
    add_column :stripe_contracts, :token, :string
    add_column :stripe_contracts, :payment_by, :string
  end
end
