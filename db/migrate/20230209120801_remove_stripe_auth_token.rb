class RemoveStripeAuthToken < ActiveRecord::Migration[6.0]
  def change
    remove_column :customer_modals, :stripe_auth_token_id
    drop_table :stripe_auth_tokens
  end
end
