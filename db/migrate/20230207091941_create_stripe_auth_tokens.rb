class CreateStripeAuthTokens < ActiveRecord::Migration[6.0]
  def change
    create_table :stripe_auth_tokens do |t|
      t.references :customer_modal, null: false, foreign_key: true
      t.string :token

      t.timestamps
    end
  end
end
