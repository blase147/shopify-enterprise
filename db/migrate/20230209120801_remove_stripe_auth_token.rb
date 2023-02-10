class RemoveStripeAuthToken < ActiveRecord::Migration[6.0]
  def change
    drop_table :stripe_auth_tokens
  end
end
