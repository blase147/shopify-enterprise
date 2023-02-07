class AddStripeProductNameAndCheckedOutToStripeContract < ActiveRecord::Migration[6.0]
  def change
    add_column :stripe_contracts, :stripe_product_name, :string
    add_column :stripe_contracts, :checked_out, :boolean
  end
end
