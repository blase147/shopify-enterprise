class AddStripeApiKeyToShop < ActiveRecord::Migration[6.0]
  def change
    add_column :shops, :stripe_api_key, :string
  end
end
